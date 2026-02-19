// routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const {
  createShift,
  getShifts,
  updateShift,
  deleteShift,
  getShiftsByDepartment
} = require('../controllers/shiftController');
const { auth, adminOnly } = require('../middleware/auth');

// Public route for student registration
router.get('/department/:department', getShiftsByDepartment);

// Protected routes
router.use(auth);

router.get('/', adminOnly, getShifts);
router.post('/', adminOnly, createShift);
router.put('/:id', adminOnly, updateShift);
router.delete('/:id', adminOnly, deleteShift);

module.exports = router;