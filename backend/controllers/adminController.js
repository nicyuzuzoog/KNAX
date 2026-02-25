const User = require('../models/User');
const Registration = require('../models/Registration');

//////////////////////////////////////////////////
// CREATE JUNIOR ADMIN
//////////////////////////////////////////////////

exports.createJuniorAdmin = async (req, res) => {
  try {
    const { fullName, email, password, department } = req.body;

    const admin = await User.create({
      fullName,
      email,
      password,
      role: 'junior_admin',
      department
    });

    res.json({
      success: true,
      admin
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// GET JUNIOR ADMINS
//////////////////////////////////////////////////

exports.getJuniorAdmins = async (req, res) => {
  try {

    const admins = await User.find({ role: 'junior_admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(admins);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// UPDATE JUNIOR ADMIN
//////////////////////////////////////////////////

exports.updateJuniorAdmin = async (req, res) => {
  try {

    const admin = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    res.json(admin);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// DELETE JUNIOR ADMIN
//////////////////////////////////////////////////

exports.deleteJuniorAdmin = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Admin deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// TOGGLE ADMIN STATUS
//////////////////////////////////////////////////

exports.toggleAdminStatus = async (req, res) => {
  try {

    const admin = await User.findById(req.params.id);

    admin.isActive = !admin.isActive;

    await admin.save();

    res.json({
      isActive: admin.isActive
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// UPDATE PERMISSIONS
//////////////////////////////////////////////////

exports.updateAdminPermissions = async (req, res) => {
  try {

    const admin = await User.findById(req.params.id);

    admin.permissions = req.body.permissions;

    await admin.save();

    res.json(admin);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// RESET PASSWORD
//////////////////////////////////////////////////

exports.resetAdminPassword = async (req, res) => {
  try {

    const admin = await User.findById(req.params.id);

    admin.password = req.body.password;

    await admin.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// DASHBOARD STATS
//////////////////////////////////////////////////

exports.getDashboardStats = async (req, res) => {
  try {

    const studentsCount = await User.countDocuments({ role: 'student' });

    const juniorAdminsCount = await User.countDocuments({
      role: 'junior_admin'
    });

    const totalRegistrations =
      await Registration.countDocuments();

    const approvedRegistrations =
      await Registration.countDocuments({
        status: 'approved'
      });

    const pendingRegistrations =
      await Registration.countDocuments({
        status: 'pending'
      });

    const registrations = await Registration.find();

    const totalEarnings = registrations.reduce(
      (sum, r) => sum + (r.amountPaid || 0),
      0
    );

    res.json({

      totalEarnings,
      totalRegistrations,
      approvedRegistrations,
      pendingRegistrations,
      juniorAdminsCount,
      studentsCount,
      schoolsCount: 0,
      departmentStats: []

    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// FINANCIAL REPORT
//////////////////////////////////////////////////

exports.generateFinancialReport = async (req, res) => {
  try {

    const registrations = await Registration.find();

    const total = registrations.reduce(
      (sum, r) => sum + (r.amountPaid || 0),
      0
    );

    res.json({
      totalEarnings: total,
      registrations
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

//////////////////////////////////////////////////
// GET STUDENTS
//////////////////////////////////////////////////

exports.getAllStudents = async (req, res) => {
  try {

    const students = await User.find({
      role: 'student'
    }).select('-password');

    const registrations =
      await Registration.find()
      .populate('school','name')
      .populate('student','fullName email');

    const result = students.map(student => {

      const reg = registrations.find(
        r => r.student?._id.toString()
        === student._id.toString()
      );

      return {

        ...student.toObject(),

        registration: reg || null,

        school: reg?.school?.name || null,

        applicationStatus:
        reg?.status || 'not_applied'

      };

    });

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message:'Server error',
      error:error.message
    });

  }
};
