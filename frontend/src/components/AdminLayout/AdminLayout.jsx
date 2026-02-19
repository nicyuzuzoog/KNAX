// src/components/AdminLayout/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaUsers, 
  FaClipboardList, 
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaSchool,
  FaBell,
  FaMoneyBillWave,
  FaClock,
  FaChartBar,
  FaGraduationCap
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items based on role
  const getMenuItems = () => {
    if (user?.role === 'super_admin') {
      return [
        { path: '/super-admin/dashboard', label: 'Dashboard', icon: FaHome },
        { path: '/super-admin/admins', label: 'Junior Admins', icon: FaUserShield },
        { path: '/super-admin/schools', label: 'Schools', icon: FaSchool },
        { path: '/super-admin/registrations', label: 'All Registrations', icon: FaClipboardList },
        { path: '/super-admin/students', label: 'All Students', icon: FaUsers },
        { path: '/super-admin/finances', label: 'Finances', icon: FaMoneyBillWave },
        { path: '/super-admin/announcements', label: 'Announcements', icon: FaBell },
        { path: '/super-admin/download-reports', label: 'Reports', icon: FaChartBar },
      ];
    } else if (user?.role === 'junior_admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
        { path: '/admin/registrations', label: 'Registrations', icon: FaClipboardList },
        { path: '/admin/attendance', label: 'Attendance', icon: FaCalendarCheck },
        { path: '/admin/timetable', label: 'Timetable', icon: FaClock },
        { path: '/admin/shifts', label: 'Shifts', icon: FaClock },
        { path: '/admin/announcements', label: 'Announcements', icon: FaBell },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : 'Junior Admin';

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FaGraduationCap className="brand-icon" />
            <div className="brand-text">
              <h2>KNAX250</h2>
              <span>{roleLabel}</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h4>{user?.fullName}</h4>
            <span>{user?.email}</span>
            {user?.department && <span className="user-dept">{user.department}</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <FaBars />
          </button>
          <div className="header-title">
            <h1>{menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}</h1>
          </div>
          <div className="header-actions">
            <div className="header-user">
              <span>{user?.fullName}</span>
              <div className="header-avatar">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;