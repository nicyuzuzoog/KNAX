// src/pages/Register/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCalendar,
  FaUserPlus,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaLaptopCode,
  FaNetworkWired,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt
} from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Name can only contain letters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(078|079|072|073)\d{7}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Valid Rwandan number required (e.g. 078XXXXXXX)';
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(ageNum)) {
      newErrors.age = 'Age must be a number';
    } else if (ageNum < 16) {
      newErrors.age = 'Must be at least 16 years old';
    } else if (ageNum > 35) {
      newErrors.age = 'Age must be 35 or below';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'At least 6 characters required';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Include at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Include at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Include at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
      toast.error('Please accept the terms and conditions');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', { icon: '⚠️' });
      return;
    }
    setLoading(true);
    try {
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim().replace(/\s/g, ''),
        age: parseInt(formData.age, 10)
      };
      const response = await register(userData);
      toast.success(response.message || 'Registration successful! Welcome to KNAX250!', {
        icon: '🎉',
        duration: 4000
      });
      setTimeout(() => {
        if (response.user?.role === 'student' || !response.user?.role) {
          navigate('/student/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.missing) {
        errorMessage = `Please fill in: ${error.response.data.missing.join(', ')}`;
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists. Please login or use a different email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { icon: '❌', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="auth-page-split">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        {/* decorative blobs */}
        <div className="blob-1" />
        <div className="blob-2" />
        <div className="blob-3" />

        {/* particles */}
        <div className="particle-field">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="ptcl"
              style={{
                left: `${10 + i * 11}%`,
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                animationDuration: `${8 + i * 2.5}s`,
                animationDelay: `${-i * 1.8}s`,
              }}
            />
          ))}
        </div>

        <div className="auth-left-content">
          {/* Brand */}
          <div className="auth-brand">
            <FaGraduationCap className="brand-icon" />
            <div>
              <h1>KNAX<span>250</span></h1>
              <p>Technical Training Center</p>
            </div>
          </div>

          {/* Eyebrow */}
          <div className="auth-eyebrow">
            ✦ RTB Certified Institution
          </div>

          {/* Features */}
          <div className="auth-features">
            <h2>Start Your Journey</h2>
            <p>Register and unlock your full potential at Rwanda's premier technical training center.</p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><FaCheckCircle /></div>
                <div className="feature-text">
                  <h4>RTB Certified</h4>
                  <p>Official certification</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaLaptopCode /></div>
                <div className="feature-text">
                  <h4>Practical Training</h4>
                  <p>Hands-on experience</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaNetworkWired /></div>
                <div className="feature-text">
                  <h4>Free WiFi</h4>
                  <p>Learn online too</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaChartLine /></div>
                <div className="feature-text">
                  <h4>Job Placement</h4>
                  <p>Career support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="auth-stats">
            <div className="auth-stat"><strong>500+</strong><span>Students</span></div>
            <div className="auth-stat"><strong>95%</strong><span>Pass Rate</span></div>
            <div className="auth-stat"><strong>12+</strong><span>Programs</span></div>
            <div className="auth-stat"><strong>3+</strong><span>Years</span></div>
          </div>

          {/* floating circles */}
          <div className="floating-elements">
            <div className="floating-circle circle-1" />
            <div className="floating-circle circle-2" />
            <div className="floating-circle circle-3" />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-container">
          {/* Mobile brand (hidden on desktop) */}
          <div className="mobile-brand-header">
            <FaGraduationCap className="brand-icon" />
            <h1>KNAX<span>250</span></h1>
          </div>

          {/* Header */}
          <div className="auth-form-header">
            <div className="auth-header-badge">
              <FaShieldAlt /> Secure Registration
            </div>
            <h2>Create Account</h2>
            <p>Join KNAX250 today and start learning</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className={`form-group ${errors.fullName ? 'error' : formData.fullName && !errors.fullName ? 'success' : ''}`}>
              <label htmlFor="fullName"><FaUser /> Full Name</label>
              <input
                type="text" id="fullName" name="fullName"
                value={formData.fullName} onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.fullName && <span className="error-text"><FaExclamationCircle /> {errors.fullName}</span>}
              {formData.fullName && !errors.fullName && <span className="success-text"><FaCheckCircle /> Looks good!</span>}
            </div>

            {/* Email */}
            <div className={`form-group ${errors.email ? 'error' : formData.email && !errors.email ? 'success' : ''}`}>
              <label htmlFor="email"><FaEnvelope /> Email Address</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && <span className="error-text"><FaExclamationCircle /> {errors.email}</span>}
              {formData.email && !errors.email && <span className="success-text"><FaCheckCircle /> Valid email</span>}
            </div>

            {/* Phone & Age */}
            <div className="form-row">
              <div className={`form-group ${errors.phone ? 'error' : formData.phone && !errors.phone ? 'success' : ''}`}>
                <label htmlFor="phone"><FaPhone /> Phone</label>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="078 XXX XXXX"
                  autoComplete="tel"
                />
                {errors.phone && <span className="error-text"><FaExclamationCircle /> {errors.phone}</span>}
                {formData.phone && !errors.phone && <span className="success-text"><FaCheckCircle /> Valid</span>}
              </div>

              <div className={`form-group ${errors.age ? 'error' : formData.age && !errors.age ? 'success' : ''}`}>
                <label htmlFor="age"><FaCalendar /> Age</label>
                <input
                  type="number" id="age" name="age"
                  value={formData.age} onChange={handleChange}
                  placeholder="16 – 35" min="16" max="35"
                />
                {errors.age && <span className="error-text"><FaExclamationCircle /> {errors.age}</span>}
                {formData.age && !errors.age && <span className="success-text"><FaCheckCircle /> Valid</span>}
              </div>
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password ? 'error' : ''}`}>
              <label htmlFor="password"><FaLock /> Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill ${passwordStrength}`} />
                  </div>
                  <span className={`strength-text ${passwordStrength}`}>
                    Strength: {passwordStrength}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-text"><FaExclamationCircle /> {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${errors.confirmPassword ? 'error' : formData.confirmPassword && !errors.confirmPassword ? 'success' : ''}`}>
              <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text"><FaExclamationCircle /> {errors.confirmPassword}</span>}
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="success-text"><FaCheckCircle /> Passwords match</span>
              )}
            </div>

            {/* Terms */}
            <div className="terms-checkbox">
              <input type="checkbox" id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)} />
              <label htmlFor="terms">
                <FaShieldAlt style={{ color: 'var(--green-dk)', marginRight: '4px' }} />
                I agree to the{' '}
                <Link to="/terms" target="_blank">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? <><span className="btn-spinner" /> Creating Account...</>
                : <><FaUserPlus /> Create Account</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span /><p>or</p><span />
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
            <p style={{ marginTop: '8px', fontSize: '.82rem' }}>
              Need help? <Link to="/contact" className="auth-link">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
