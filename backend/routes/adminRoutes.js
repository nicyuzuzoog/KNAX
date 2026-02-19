// routes/adminRoutes.js
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
  getAllStudents
} = require('../controllers/adminController');
const { auth, superAdminOnly } = require('../middleware/auth');

// All routes require authentication and super admin role
router.use(auth);
router.use(superAdminOnly);

// Junior Admin CRUD
router.post('/junior-admins', createJuniorAdmin);
router.get('/junior-admins', getJuniorAdmins);
router.put('/junior-admins/:id', updateJuniorAdmin);
router.delete('/junior-admins/:id', deleteJuniorAdmin);
router.patch('/junior-admins/:id/toggle', toggleAdminStatus);
router.patch('/junior-admins/:id/permissions', updateAdminPermissions);
router.post('/junior-admins/:id/reset-password', resetAdminPassword);

// Dashboard & Reports
router.get('/dashboard-stats', getDashboardStats);
router.get('/financial-report', generateFinancialReport);
router.get('/students', getAllStudents);

module.exports = router;