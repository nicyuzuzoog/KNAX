import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader/Loader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Departments from './pages/Departments/Departments';
import Equipment from './pages/Equipment/Equipment';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import ManageAdmins from './pages/SuperAdmin/ManageAdmins';
import ManageSchools from './pages/SuperAdmin/ManageSchools';
import AllRegistrations from './pages/SuperAdmin/AllRegistrations';
import FinancialReports from './pages/SuperAdmin/FinancialReports';
import DownloadReports from './pages/SuperAdmin/DownloadReports';

// Junior Admin Pages
import AdminDashboard from './pages/JuniorAdmin/Dashboard';
import AdminRegistrations from './pages/JuniorAdmin/Registrations';
import ManageAttendance from './pages/JuniorAdmin/ManageAttendance';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import ApplyInternship from './pages/Student/ApplyInternship';
import MyAttendance from './pages/Student/MyAttendance';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  const getDefaultRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'super_admin':
        return '/super-admin/dashboard';
      case 'junior_admin':
        return '/admin/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      {/* Public Routes - Each page has its own header/navigation */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} /> : <Login />} />
      <Route path="/register" element={
        user && (user.role === 'super_admin' || user.role === 'junior_admin') 
          ? <Navigate to={getDefaultRoute()} /> 
          : <Register />
      } />
      <Route path="/departments" element={<Departments />} />
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Super Admin Routes */}
      <Route path="/super-admin/dashboard" element={
        <ProtectedRoute roles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>
      } />
      <Route path="/super-admin/admins" element={
        <ProtectedRoute roles={['super_admin']}><ManageAdmins /></ProtectedRoute>
      } />
      <Route path="/super-admin/schools" element={
        <ProtectedRoute roles={['super_admin']}><ManageSchools /></ProtectedRoute>
      } />
      <Route path="/super-admin/registrations" element={
        <ProtectedRoute roles={['super_admin']}><AllRegistrations /></ProtectedRoute>
      } />
      <Route path="/super-admin/finances" element={
        <ProtectedRoute roles={['super_admin']}><FinancialReports /></ProtectedRoute>
      } />
      <Route path="/super-admin/download-reports" element={
        <ProtectedRoute roles={['super_admin']}><DownloadReports /></ProtectedRoute>
      } />

      {/* Junior Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['junior_admin']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/registrations" element={
        <ProtectedRoute roles={['junior_admin']}><AdminRegistrations /></ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute roles={['junior_admin']}><ManageAttendance /></ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/student/apply" element={
        <ProtectedRoute roles={['student']}><ApplyInternship /></ProtectedRoute>
      } />
      <Route path="/student/attendance" element={
        <ProtectedRoute roles={['student']}><MyAttendance /></ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;