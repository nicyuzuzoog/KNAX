// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing/Landing';
import About from './pages/About/About';
import Departments from './pages/Departments/Departments';
import Equipment from './pages/Equipment/Equipment';
import Contact from './pages/Contact/Contact';
import FindUs from './pages/FindUs/FindUs';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import ManageAdmins from './pages/SuperAdmin/ManageAdmins';
import ManageSchools from './pages/SuperAdmin/ManageSchools';
import AllRegistrations from './pages/SuperAdmin/AllRegistrations';
import AllStudents from './pages/SuperAdmin/AllStudents';
import SuperAdminAnnouncements from './pages/SuperAdmin/Announcements';
import FinancialReports from './pages/SuperAdmin/FinancialReports';
import DownloadReports from './pages/SuperAdmin/DownloadReports';

// Junior Admin Pages
import JuniorAdminDashboard from './pages/JuniorAdmin/Dashboard';
import JuniorAdminRegistrations from './pages/JuniorAdmin/Registrations';
import JuniorAdminAttendance from './pages/JuniorAdmin/ManageAttendance';
import JuniorAdminTimetable from './pages/JuniorAdmin/ManageTimetable';
import JuniorAdminShifts from './pages/JuniorAdmin/ManageShifts';
import JuniorAdminAnnouncements from './pages/JuniorAdmin/Announcements';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import ApplyInternship from './pages/Student/ApplyInternship';
import MyAttendance from './pages/Student/MyAttendance';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/find-us" element={<FindUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>
          } />
          <Route path="/super-admin/admins" element={
            <ProtectedRoute allowedRoles={['super_admin']}><ManageAdmins /></ProtectedRoute>
          } />
          <Route path="/super-admin/schools" element={
            <ProtectedRoute allowedRoles={['super_admin']}><ManageSchools /></ProtectedRoute>
          } />
          <Route path="/super-admin/registrations" element={
            <ProtectedRoute allowedRoles={['super_admin']}><AllRegistrations /></ProtectedRoute>
          } />
          <Route path="/super-admin/students" element={
            <ProtectedRoute allowedRoles={['super_admin']}><AllStudents /></ProtectedRoute>
          } />
          <Route path="/super-admin/announcements" element={
            <ProtectedRoute allowedRoles={['super_admin']}><SuperAdminAnnouncements /></ProtectedRoute>
          } />
          <Route path="/super-admin/finances" element={
            <ProtectedRoute allowedRoles={['super_admin']}><FinancialReports /></ProtectedRoute>
          } />
          <Route path="/super-admin/download-reports" element={
            <ProtectedRoute allowedRoles={['super_admin']}><DownloadReports /></ProtectedRoute>
          } />

          {/* Junior Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/registrations" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminRegistrations /></ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminAttendance /></ProtectedRoute>
          } />
          <Route path="/admin/timetable" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminTimetable /></ProtectedRoute>
          } />
          <Route path="/admin/shifts" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminShifts /></ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute allowedRoles={['junior_admin']}><JuniorAdminAnnouncements /></ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/apply" element={
            <ProtectedRoute allowedRoles={['student']}><ApplyInternship /></ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute allowedRoles={['student']}><MyAttendance /></ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;