const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
  getMyRegistration,
  getRegistrationById,
  completeInternship
} = require('../controllers/registrationController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

// Student routes
router.post('/', upload.single('receipt'), createRegistration);
router.get('/my-registration', getMyRegistration);

// Admin routes
router.get('/', adminOnly, getAllRegistrations);
router.get('/:id', adminOnly, getRegistrationById);
router.patch('/:id/status', adminOnly, updateRegistrationStatus);
router.patch('/:id/complete', adminOnly, completeInternship);

module.exports = router;