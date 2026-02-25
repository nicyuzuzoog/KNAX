const express = require('express');
const router = express.Router();

// ===== IMPORT CONTROLLERS SAFELY =====
let controllers = {};
try {
  controllers = require('../controllers/adminController');
} catch (err) {
  console.error("⚠ adminController.js not found or failed to load", err);
}

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
} = controllers;

// ===== IMPORT MIDDLEWARE SAFELY =====
let middleware = {};
try {
  middleware = require('../middleware/auth');
} catch (err) {
  console.error("⚠ auth.js not found or failed to load", err);
}

const { auth, superAdminOnly } = middleware;

// ===== APPLY MIDDLEWARE =====
if (auth) router.use(auth);
if (superAdminOnly) router.use(superAdminOnly);

// ===== ADMIN ROUTES =====
if (createJuniorAdmin) router.post('/junior-admins', createJuniorAdmin);
if (getJuniorAdmins) router.get('/junior-admins', getJuniorAdmins);
if (updateJuniorAdmin) router.put('/junior-admins/:id', updateJuniorAdmin);
if (deleteJuniorAdmin) router.delete('/junior-admins/:id', deleteJuniorAdmin);
if (toggleAdminStatus) router.patch('/junior-admins/:id/toggle', toggleAdminStatus);
if (updateAdminPermissions) router.patch('/junior-admins/:id/permissions', updateAdminPermissions);
if (resetAdminPassword) router.post('/junior-admins/:id/reset-password', resetAdminPassword);

// ===== DASHBOARD =====
if (getDashboardStats) router.get('/dashboard-stats', getDashboardStats);
if (generateFinancialReport) router.get('/financial-report', generateFinancialReport);

// ===== STUDENTS =====
if (getAllStudents) router.get('/students', getAllStudents);
if (toggleStudentStatus) router.patch('/students/:id/toggle-status', toggleStudentStatus);
if (deleteStudent) router.delete('/students/:id', deleteStudent);

module.exports = router;
