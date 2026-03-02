const express = require('express');
const router = express.Router();

const {
  markAttendance,
  getAttendanceByRegistration,
  getAttendanceByDate,
  getActiveInterns,
  getMyAttendance
} = require('../controllers/attendanceController');

const { auth, adminOnly } = require('../middleware/auth');

// Mark attendance
router.post('/', auth, adminOnly, markAttendance);

// Get active interns
router.get('/active-interns', auth, adminOnly, getActiveInterns);

// Get attendance by date
router.get('/by-date', auth, adminOnly, getAttendanceByDate);

// Get attendance by registration
router.get('/registration/:registrationId', auth, getAttendanceByRegistration);

// Get logged-in student attendance
router.get('/my-attendance', auth, getMyAttendance);

module.exports = router;
