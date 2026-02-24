// controllers/adminController.js
const User = require('../models/User');
const Registration = require('../models/Registration');

// GET all students dynamically, safe populate
exports.getAllStudents = async (req, res) => {
  try {
    const { status } = req.query;

    // Fetch all students
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Fetch registrations, safely populate school and class
    const registrations = await Registration.find()
      .populate({ path: 'school', select: 'name', strictPopulate: false })
      .populate({ path: 'class', select: 'name', strictPopulate: false })
      .populate({ path: 'student', select: 'fullName email phone' });

    const studentsWithStatus = students.map(student => {
      const reg = registrations.find(r => r.student?._id.toString() === student._id.toString());
      return {
        ...student.toObject(),
        hasApplied: !!reg,
        registration: reg || null,
        applicationStatus: reg?.paymentStatus || 'not_applied',
        class: reg?.class?.name || null,
        school: reg?.school?.name || null
      };
    });

    let filtered = studentsWithStatus;
    if (status === 'applied') filtered = studentsWithStatus.filter(s => s.hasApplied);
    else if (status === 'not_applied') filtered = studentsWithStatus.filter(s => !s.hasApplied);
    else if (status === 'approved') filtered = studentsWithStatus.filter(s => s.applicationStatus === 'approved');
    else if (status === 'pending') filtered = studentsWithStatus.filter(s => s.applicationStatus === 'pending');

    res.json(filtered);

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(id);
    await Registration.deleteMany({ student: id }); // remove registrations too

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle student active status (e.g., deactivate/reactivate)
exports.toggleStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });

    student.isActive = !student.isActive;
    await student.save();

    res.json({ message: `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`, isActive: student.isActive });
  } catch (error) {
    console.error('Error toggling student status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
