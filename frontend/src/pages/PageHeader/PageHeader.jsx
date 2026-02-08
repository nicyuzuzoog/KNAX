// components/PageHeader/PageHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaGraduationCap, 
  FaArrowLeft, 
  FaSignInAlt, 
  FaUserPlus,
  FaUsers,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './PageHeader.css';

const PageHeader = ({ showBack = true, backTo = '/' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <header className={`page-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Back Button */}
          {showBack && (
            <button 
              onClick={() => navigate(backTo)} 
              className="header-back-btn"
            >
              <FaArrowLeft /> Back
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="header-logo">
            <FaGraduationCap className="logo-icon" />
            <div className="logo-text">
              <span className="logo-main">KNAX_250</span>
              <span className="logo-sub">TECHNOLOGY</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/departments" className="nav-link">Departments</Link>
            <Link to="/equipment" className="nav-link">Equipment</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="header-auth">
            {user ? (
              <Link to={getDefaultRoute()} className="auth-btn dashboard-btn">
                <FaUsers /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="auth-btn login-btn">
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="auth-btn register-btn">
                  <FaUserPlus />
                  <span>Register</span>
                  <div className="btn-glow"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/departments" onClick={() => setMobileMenuOpen(false)}>Departments</Link>
            <Link to="/equipment" onClick={() => setMobileMenuOpen(false)}>Equipment</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {!user && (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default PageHeader;