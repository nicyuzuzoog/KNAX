// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');

// Get ALL attendance (Admin or general view)
router.get('/', auth, async (req, res) => {
  try {

    // Example if model exists:
    // const Attendance = require('../models/Attendance');
    // const attendance = await Attendance.find().populate('student','fullName');

    res.json({
      attendance: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }
});


/*
==============================
IMPORTANT ROUTE FOR DASHBOARD
==============================
*/

// Get Logged-in Student Attendance
router.get('/my-attendance', auth, async (req, res) => {

  try {

    // If Attendance model exists:
    // const Attendance = require('../models/Attendance');
    // const attendance = await Attendance.find({
    //   student: req.user.id
    // }).sort({ date: -1 });

    res.json({
      attendance: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error fetching attendance'
    });

  }

});


// Mark attendance (Admin)
router.post('/', auth, adminOnly, async (req, res) => {

  try {

    const { studentId, date, status, shift } = req.body;

    res.json({
      message: 'Attendance marked',
      attendance: {}
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

});


// Get attendance by date
router.get('/date/:date', auth, async (req, res) => {

  try {

    res.json({
      attendance: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

});


// Get attendance by studentId
router.get('/student/:studentId', auth, async (req, res) => {

  try {

    res.json({
      attendance: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

});

module.exports = router;
