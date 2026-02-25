// controllers/adminController.js

const User = require('../models/User');
const Registration = require('../models/Registration');
const School = require('../models/School');


/*
==============================
GET ALL STUDENTS
Used by:
GET /api/admin/students
==============================
*/

exports.getAllStudents = async (req, res) => {
  try {

    const students = await User.find({ role: "student" })
      .populate("school", "name")
      .populate("class", "name")
      .sort({ createdAt: -1 });

    const registrations = await Registration.find()
      .populate("student");

    const result = students.map(student => {

      const registration = registrations.find(r =>
        r.student?._id.toString() === student._id.toString()
      );

      return {
        ...student.toObject(),
        registration: registration || null
      };

    });

    res.json(result);

  } catch (error) {

    console.log("ADMIN STUDENTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};



/*
==============================
TOGGLE STUDENT STATUS
PATCH /admin/students/:id/toggle-status
==============================
*/

exports.toggleStudentStatus = async (req, res) => {

  try {

    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    student.isActive = !student.isActive;

    await student.save();

    res.json({
      message: "Student status updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating student",
      error: error.message
    });

  }

};



/*
==============================
DELETE STUDENT
DELETE /admin/students/:id
==============================
*/

exports.deleteStudent = async (req, res) => {

  try {

    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    await student.deleteOne();

    res.json({
      message: "Student deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });

  }

};



/*
==============================
DASHBOARD STATS
GET /admin/dashboard-stats
==============================
*/

exports.getDashboardStats = async (req, res) => {

  try {

    const studentsCount = await User.countDocuments({
      role: "student"
    });

    const juniorAdminsCount = await User.countDocuments({
      role: "junior_admin"
    });

    const schoolsCount = await School.countDocuments();

    const registrations = await Registration.find();

    const approvedRegistrations =
      registrations.filter(r => r.paymentStatus === "approved").length;

    const pendingRegistrations =
      registrations.filter(r => r.paymentStatus === "pending").length;

    const totalRegistrations = registrations.length;

    res.json({

      totalEarnings: approvedRegistrations * 2000,

      totalRegistrations,

      approvedRegistrations,

      pendingRegistrations,

      juniorAdminsCount,

      studentsCount,

      schoolsCount,

      departmentStats: []

    });

  } catch (error) {

    res.status(500).json({
      message: "Stats error",
      error: error.message
    });

  }

};
