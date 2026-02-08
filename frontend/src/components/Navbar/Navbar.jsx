import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/super-admin/dashboard';
      case 'junior_admin':
        return '/admin/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text" style={{ color: '#1976D2', fontWeight: 'bold' }}>
            KNAX250
          </span>
          <span className="logo-tagline">Technical Training Center</span>
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/departments" className="nav-link" onClick={() => setIsOpen(false)}>
            Departments
          </Link>
          <Link to="/equipment" className="nav-link" onClick={() => setIsOpen(false)}>
            Equipment
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          {user ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="nav-user">
                <FaUser />
                <span>{user.fullName}</span>
              </div>
              <button className="nav-logout" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;