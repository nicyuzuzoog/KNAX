// components/AdminSidebar/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaClipboardList,
  FaUserShield,
  FaSchool,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaDownload,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUsers
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isJuniorAdmin = user?.role === 'junior_admin';

  const isActive = (path) => location.pathname.includes(path);

  return (
    <>
      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaGraduationCap />
          </div>
          <div className="sidebar-brand">
            <h2>KNAX_250</h2>
            <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="user-info">
            <h4>{user?.fullName || 'Admin'}</h4>
            <p>{user?.department || 'All Departments'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Super Admin Links */}
          {isSuperAdmin && (
            <>
              <Link 
                to="/super-admin/dashboard" 
                className={`nav-link ${isActive('/super-admin/dashboard') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaHome />
                <span>Dashboard</span>
              </Link>

              <Link 
                to="/super-admin/admins" 
                className={`nav-link ${isActive('/super-admin/admins') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaUserShield />
                <span>Manage Admins</span>
              </Link>

              <Link 
                to="/super-admin/schools" 
                className={`nav-link ${isActive('/super-admin/schools') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaSchool />
                <span>Manage Schools</span>
              </Link>

              <Link 
                to="/super-admin/registrations" 
                className={`nav-link ${isActive('/super-admin/registrations') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaClipboardList />
                <span>All Registrations</span>
              </Link>

              <Link 
                to="/super-admin/finances" 
                className={`nav-link ${isActive('/super-admin/finances') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaMoneyBillWave />
                <span>Financial Reports</span>
              </Link>

              <Link 
                to="/super-admin/download-reports" 
                className={`nav-link ${isActive('/super-admin/download-reports') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaDownload />
                <span>Download Reports</span>
              </Link>
            </>
          )}

          {/* Junior Admin Links */}
          {isJuniorAdmin && (
            <>
              <Link 
                to="/admin/dashboard" 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaHome />
                <span>Dashboard</span>
              </Link>

              <Link 
                to="/admin/registrations" 
                className={`nav-link ${isActive('/admin/registrations') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaClipboardList />
                <span>Registrations</span>
              </Link>

              <Link 
                to="/admin/attendance" 
                className={`nav-link ${isActive('/admin/attendance') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <FaCalendarCheck />
                <span>Attendance</span>
              </Link>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default AdminSidebar;