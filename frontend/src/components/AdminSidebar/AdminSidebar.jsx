import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaUserShield, 
  FaSchool, 
  FaClipboardList,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaCog,
  FaUser
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Super Admin Menu Items
  const superAdminMenu = [
    { path: '/super-admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/super-admin/admins', icon: <FaUserShield />, label: 'Manage Admins' },
    { path: '/super-admin/schools', icon: <FaSchool />, label: 'Schools & Classes' },
    { path: '/super-admin/registrations', icon: <FaClipboardList />, label: 'Registrations' },
    { path: '/super-admin/finances', icon: <FaMoneyBillWave />, label: 'Financial Reports' },
    { path: '/super-admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  // Junior Admin Menu Items - based on permissions
  const getJuniorAdminMenu = () => {
    const menu = [
      { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    ];

    // Check permissions from user object
    if (user?.permissions?.canViewRegistrations !== false) {
      menu.push({ path: '/admin/registrations', icon: <FaClipboardList />, label: 'Registrations' });
    }

    if (user?.permissions?.canManageAttendance !== false) {
      menu.push({ path: '/admin/attendance', icon: <FaCalendarCheck />, label: 'Attendance' });
    }

    return menu;
  };

  const menuItems = user?.role === 'super_admin' ? superAdminMenu : getJuniorAdminMenu();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-text" style={{ color: '#1976D2' }}>
              {isCollapsed ? 'K' : 'KNAX250'}
            </span>
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <FaUser />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">{user?.fullName}</span>
              <span className="user-role">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Junior Admin'}
              </span>
              {user?.department && (
                <span className="user-dept">{user.department}</span>
              )}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Download Reports Button (Super Admin Only) */}
        {user?.role === 'super_admin' && (
          <div className="sidebar-actions">
            <NavLink 
              to="/super-admin/download-reports" 
              className="action-btn download-btn"
            >
              <FaDownload />
              {!isCollapsed && <span>Download Reports</span>}
            </NavLink>
          </div>
        )}

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;