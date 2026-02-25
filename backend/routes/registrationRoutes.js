// routes/registrationRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Controllers
const registrationController = require('../controllers/registrationController');

// Middleware
const { auth, adminOnly } = require('../middleware/auth');


// =====================================================
// ENSURE UPLOAD DIRECTORY EXISTS
// =====================================================

const uploadDir = path.join(__dirname, '../uploads/receipts');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// =====================================================
// MULTER CONFIGURATION (Receipt Upload)
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      "receipt-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }

});


const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|gif|pdf/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDF files allowed"));
    }

  }

});


// =====================================================
// AUTH REQUIRED FOR ALL ROUTES
// =====================================================

router.use(auth);


// =====================================================
// STUDENT ROUTES
// =====================================================

/*
Apply for internship
POST /api/registrations/apply
*/
router.post(
  '/apply',
  upload.single('receiptPhoto'),
  registrationController.createRegistration
);


/*
Get my registration
GET /api/registrations/my-registration
*/
router.get(
  '/my-registration',
  registrationController.getMyRegistration
);



// =====================================================
// ADMIN ROUTES
// =====================================================

/*
Get all registrations
GET /api/registrations
*/
router.get(
  '/',
  registrationController.getRegistrations
);


/*
Get single registration
GET /api/registrations/:id
*/
router.get(
  '/:id',
  registrationController.getRegistration
);


/*
Update registration
PUT /api/registrations/:id
*/
router.put(
  '/:id',
  upload.single('receiptPhoto'),
  registrationController.updateRegistration
);


/*
Delete registration
DELETE /api/registrations/:id
*/
router.delete(
  '/:id',
  adminOnly,
  registrationController.deleteRegistration
);



// =====================================================
// PAYMENT STATUS ROUTES
// =====================================================

/*
Update payment status
PATCH /api/registrations/:id/status
*/
router.patch(
  '/:id/status',
  registrationController.updatePaymentStatus
);


/*
Approve payment
PATCH /api/registrations/:id/approve
*/
router.patch(
  '/:id/approve',
  registrationController.approvePayment
);


/*
Reject payment
PATCH /api/registrations/:id/reject
*/
router.patch(
  '/:id/reject',
  registrationController.rejectPayment
);



// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
