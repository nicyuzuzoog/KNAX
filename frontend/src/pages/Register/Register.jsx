// pages/Register/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';
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
  FaEyeSlash
} from 'react-icons/fa';
import './Auth.css';

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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Age validation
    const ageNum = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 16 || ageNum > 35) {
      newErrors.age = 'Age must be between 16 and 35';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Prepare data - IMPORTANT: Convert age to number and remove confirmPassword
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        age: parseInt(formData.age, 10) // Ensure age is a number
      };

      console.log('📝 Submitting registration:', { ...userData, password: '***' });

      const response = await register(userData);
      
      console.log('✅ Registration successful:', response);
      
      // Show success message
      toast.success(response.message || 'Registration successful! Welcome to KNAX250!');
      
      // Navigate based on role
      if (response.user?.role === 'student' || !response.user?.role) {
        navigate('/student/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error details:', error.response?.data);
      
      // Handle specific error messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.missing) {
        errorMessage = `Please fill in: ${error.response.data.missing.join(', ')}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-page">
      <BackButton to="/" text="Back to Home" />

      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <FaGraduationCap />
          </div>
          <h1>Create Account</h1>
          <p>Join KNAX250 and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className={`form-group ${errors.fullName ? 'error' : ''}`}>
            <label>
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label>
              <FaEnvelope /> Email Address
            </label>
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

          {/* Phone & Age Row */}
          <div className="form-row">
            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
              <label>
                <FaPhone /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
                autoComplete="tel"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className={`form-group ${errors.age ? 'error' : ''}`}>
              <label>
                <FaCalendar /> Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="16-35"
                min="16"
                max="35"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
          </div>

          {/* Password */}
          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label>
              <FaLock /> Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`}></div>
                </div>
                <span className={`strength-text ${passwordStrength}`}>
                  Password strength: {passwordStrength}
                </span>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
            <label>
              <FaLock /> Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Terms Checkbox */}
          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>Creating Account...</>
            ) : (
              <><FaUserPlus /> Create Account</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;