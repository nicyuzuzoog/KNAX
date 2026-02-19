// routes/timetableRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTimetable,
  addTimetable,
  updateTimetable,
  deleteTimetable
} = require('../controllers/timetableController');
const { auth, adminOnly } = require('../middleware/auth');

// Get timetable - available to all authenticated users
router.get('/', auth, getTimetable);

// Admin routes (both super_admin and junior_admin with permissions)
router.post('/', auth, adminOnly, addTimetable);
router.patch('/:id', auth, adminOnly, updateTimetable);
router.delete('/:id', auth, adminOnly, deleteTimetable);

module.exports = router;