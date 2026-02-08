const express = require('express');
const router = express.Router();
const {
  getTimetable,
  addTimetable,
  updateTimetable,
  deleteTimetable
} = require('../controllers/timetableController');
const { auth, superAdminOnly } = require('../middleware/auth');

router.get('/', auth, getTimetable);
router.post('/', auth, superAdminOnly, addTimetable);
router.patch('/:id', auth, superAdminOnly, updateTimetable);
router.delete('/:id', auth, superAdminOnly, deleteTimetable);

module.exports = router;