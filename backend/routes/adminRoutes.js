const express = require('express');
const router = express.Router();
const {
  createJuniorAdmin,
  getJuniorAdmins,
  toggleAdminStatus,
  getDashboardStats,
  deleteJuniorAdmin,
  updateAdminPermissions,
  generateFinancialReport
} = require('../controllers/adminController');
const { auth, superAdminOnly } = require('../middleware/auth');

router.use(auth);
router.use(superAdminOnly);

router.post('/junior-admins', createJuniorAdmin);
router.get('/junior-admins', getJuniorAdmins);
router.patch('/junior-admins/:id/toggle', toggleAdminStatus);
router.patch('/junior-admins/:id/permissions', updateAdminPermissions);
router.delete('/junior-admins/:id', deleteJuniorAdmin);
router.get('/dashboard-stats', getDashboardStats);
router.get('/financial-report', generateFinancialReport);

module.exports = router;