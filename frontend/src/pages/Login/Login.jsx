// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaLaptopCode,
  FaNetworkWired,
  FaChartLine,
  FaMicrochip,
  FaWifi,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const data = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      console.log('Login response:', data);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      
      toast.success(`Welcome back, ${data.user.fullName}!`, {
        icon: '👋',
        duration: 3000
      });

      // Redirect based on role
      setTimeout(() => {
        switch (data.user.role) {
          case 'super_admin':
            navigate('/super-admin/dashboard', { replace: true });
            break;
          case 'junior_admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'student':
            navigate('/student/dashboard', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'Account not found. Please register first.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        icon: '❌',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  // Load remember me data on mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (remembered && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="auth-page-split">
        {/* Left Side - Animated Design */}
        <div className="auth-left">
          <div className="auth-left-content">
            {/* Brand Section */}
            <div className="auth-brand">
              <FaGraduationCap className="brand-icon" />
              <h1>KNAX<span>250</span></h1>
              <p>Technical Training Center</p>
            </div>

            {/* Features Section */}
            <div className="auth-features">
              <h2>Transform Your Future</h2>
              <p>Join Rwanda's leading technical training center</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaLaptopCode />
                  </div>
                  <div className="feature-text">
                    <h4>Software Development</h4>
                    <p>Web & Mobile Apps</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaNetworkWired />
                  </div>
                  <div className="feature-text">
                    <h4>Networking & IT</h4>
                    <p>Infrastructure & Security</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaChartLine />
                  </div>
                  <div className="feature-text">
                    <h4>Accounting</h4>
                    <p>Financial Management</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaMicrochip />
                  </div>
                  <div className="feature-text">
                    <h4>Electronics</h4>
                    <p>Repair & Maintenance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
              <div className="floating-circle circle-3"></div>
              <div className="floating-icon icon-1"><FaWifi /></div>
              <div className="floating-icon icon-2"><FaLaptopCode /></div>
              <div className="floating-icon icon-3"><FaNetworkWired /></div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            {/* Mobile Brand Header (hidden on desktop) */}
            <div className="mobile-brand-header">
              <FaGraduationCap className="brand-icon" />
              <h1>KNAX<span>250</span></h1>
            </div>

            {/* Form Header */}
            <div className="auth-form-header">
              <h2>Welcome Back</h2>
              <p>Login to your account to continue</p>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Email Field */}
              <div className={`form-group ${errors.email ? 'error' : formData.email && !errors.email ? 'success' : ''}`}>
                <label htmlFor="email">
                  <FaEnvelope /> Email Address
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email address"
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span className="error-text" id="email-error">
                    <FaExclamationCircle /> {errors.email}
                  </span>
                )}
                {formData.email && !errors.email && (
                  <span className="success-text">
                    <FaCheckCircle /> Valid email
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password"
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text" id="password-error">
                    <FaExclamationCircle /> {errors.password}
                  </span>
                )}
              </div>

              {/* Form Options */}
              <div className="form-options">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    aria-label="Remember me"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} 
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <FaSignInAlt /> Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                Don't have an account? {' '}
                <Link to="/register" className="auth-link">
                  Register here
                </Link>
              </p>
              <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Need help? <Link to="/contact" className="auth-link">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;