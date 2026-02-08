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

router.use(auth);

// Student route
router.get('/my-attendance', getMyAttendance);

// Admin routes
router.post('/', adminOnly, markAttendance);
router.get('/active-interns', adminOnly, getActiveInterns);
router.get('/by-date', adminOnly, getAttendanceByDate);
router.get('/registration/:registrationId', adminOnly, getAttendanceByRegistration);

module.exports = router;