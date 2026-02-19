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
  FaWifi
} from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await login(formData);
      
      console.log('Login response:', data);
      
      toast.success(`Welcome back, ${data.user.fullName}!`);

      // Redirect based on role
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
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="auth-page-split">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-brand">
              <FaGraduationCap className="brand-icon" />
              <h1>KNAX<span>250</span></h1>
              <p>Technical Training Center</p>
            </div>
            <div className="auth-features">
              <h2>Transform Your Future</h2>
              <p>Join Rwanda's leading technical training center</p>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon"><FaLaptopCode /></div>
                  <div className="feature-text">
                    <h4>Software Development</h4>
                    <p>Web & Mobile Apps</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><FaNetworkWired /></div>
                  <div className="feature-text">
                    <h4>Networking & IT</h4>
                    <p>Infrastructure & Security</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><FaChartLine /></div>
                  <div className="feature-text">
                    <h4>Accounting</h4>
                    <p>Financial Management</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><FaMicrochip /></div>
                  <div className="feature-text">
                    <h4>Electronics</h4>
                    <p>Repair & Maintenance</p>
                  </div>
                </div>
              </div>
            </div>
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

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Welcome Back</h2>
              <p>Login to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label><FaEnvelope /> Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label><FaLock /> Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} 
                disabled={loading}
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <FaSignInAlt /> Login
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;