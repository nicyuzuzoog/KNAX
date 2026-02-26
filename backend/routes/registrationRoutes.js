const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const fs = require('fs');

const registrationController =
require('../controllers/registrationController');

const { auth, adminOnly } =
require('../middleware/auth');


// ==========================
// UPLOAD SETUP
// ==========================

const uploadDir = 'uploads/receipts';

if (!fs.existsSync(uploadDir)) {

fs.mkdirSync(uploadDir, { recursive: true });

}


const storage = multer.diskStorage({

destination: (req, file, cb) => {

cb(null, uploadDir);

},

filename: (req, file, cb) => {

cb(null,

Date.now() +

path.extname(file.originalname)

);

}

});


const upload = multer({ storage });


// ==========================
// AUTH REQUIRED
// ==========================

router.use(auth);


// ==========================
// STUDENT ROUTES
// ==========================

router.post(
'/apply',
upload.single('receiptPhoto'),
registrationController.createRegistration
);


router.get(
'/my-registration',
registrationController.getMyRegistration
);


// ==========================
// ADMIN ROUTES
// ==========================

router.get(
'/',
registrationController.getRegistrations
);


router.get(
'/:id',
registrationController.getRegistration
);


router.put(
'/:id',
registrationController.updateRegistration
);


router.delete(
'/:id',
adminOnly,
registrationController.deleteRegistration
);


// ==========================
// PAYMENT
// ==========================

router.patch(
'/:id/status',
registrationController.updatePaymentStatus
);


router.patch(
'/:id/approve',
registrationController.approvePayment
);


router.patch(
'/:id/reject',
registrationController.rejectPayment
);


module.exports = router;
