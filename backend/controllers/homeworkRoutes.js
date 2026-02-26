const express = require('express');

const router = express.Router();

const homeworkController =
require('../controllers/homeworkController');

const { auth, adminOnly } =
require('../middleware/auth');


// =====================
// AUTH REQUIRED
// =====================

router.use(auth);


// =====================
// STUDENT ROUTE
// =====================

router.get(
'/my-homeworks',
homeworkController.getMyHomeworks
);


// =====================
// ADMIN ROUTES
// =====================

router.post(
'/',
adminOnly,
homeworkController.createHomework
);


router.get(
'/',
adminOnly,
homeworkController.getHomeworks
);


router.delete(
'/:id',
adminOnly,
homeworkController.deleteHomework
);


module.exports = router;
