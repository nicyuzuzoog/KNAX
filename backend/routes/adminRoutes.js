const express = require('express');

const router = express.Router();

const {

createJuniorAdmin,
getJuniorAdmins,
updateJuniorAdmin,
toggleAdminStatus,
deleteJuniorAdmin,
updateAdminPermissions,
resetAdminPassword,

getDashboardStats,
generateFinancialReport,

getAllStudents,
toggleStudentStatus,
deleteStudent

}=require('../controllers/adminController');


const {auth,superAdminOnly}=require('../middleware/auth');


router.use(auth);

router.use(superAdminOnly);



/*
ADMINS
*/

router.post(
'/junior-admins',
createJuniorAdmin
);


router.get(
'/junior-admins',
getJuniorAdmins
);


router.put(
'/junior-admins/:id',
updateJuniorAdmin
);


router.delete(
'/junior-admins/:id',
deleteJuniorAdmin
);


router.patch(
'/junior-admins/:id/toggle',
toggleAdminStatus
);


router.patch(
'/junior-admins/:id/permissions',
updateAdminPermissions
);


router.post(
'/junior-admins/:id/reset-password',
resetAdminPassword
);



/*
DASHBOARD
*/

router.get(
'/dashboard-stats',
getDashboardStats
);


router.get(
'/financial-report',
generateFinancialReport
);



/*
STUDENTS
*/

router.get(
'/students',
getAllStudents
);


router.patch(
'/students/:id/toggle-status',
toggleStudentStatus
);


router.delete(
'/students/:id',
deleteStudent
);



module.exports=router;
