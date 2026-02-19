// routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controller
const registrationController = require('../controllers/registrationController');

// Import auth middleware
const { auth, adminOnly } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = 'uploads/receipts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `receipt-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs allowed'));
    }
  }
});

// Apply auth to all routes
router.use(auth);

// Student routes
router.get('/my-registration', registrationController.getMyRegistration);
router.post('/', upload.single('receiptPhoto'), registrationController.createRegistration);

// Admin routes
router.get('/', registrationController.getRegistrations);
router.get('/:id', registrationController.getRegistration);
router.put('/:id', upload.single('receiptPhoto'), registrationController.updateRegistration);
router.delete('/:id', adminOnly, registrationController.deleteRegistration);

// ============================================
// PAYMENT STATUS ROUTES - ALL VARIATIONS
// ============================================

// Status update (generic - handles approve/reject via body)
router.patch('/:id/status', registrationController.updatePaymentStatus);
router.put('/:id/status', registrationController.updatePaymentStatus);
router.post('/:id/status', registrationController.updatePaymentStatus);

// Specific approve route
router.patch('/:id/approve', registrationController.approvePayment);
router.post('/:id/approve', registrationController.approvePayment);
router.put('/:id/approve', registrationController.approvePayment);

// Specific reject route
router.patch('/:id/reject', registrationController.rejectPayment);
router.post('/:id/reject', registrationController.rejectPayment);
router.put('/:id/reject', registrationController.rejectPayment);

module.exports = router;