import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import { 
  FaEnvelope, 
  FaArrowLeft,
  FaGraduationCap,
  FaPaperPlane
} from 'react-icons/fa';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: email.toLowerCase().trim() });
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <FaGraduationCap />
            </div>
            <h1>Forgot Password?</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label><FaEnvelope /> Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                <FaPaperPlane /> Send Reset Link
              </button>

              <div className="auth-footer" style={{ marginTop: '20px' }}>
                <Link to="/login" className="back-link">
                  <FaArrowLeft /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="email-sent-message">
              <div className="success-icon">
                <FaPaperPlane />
              </div>
              <h3>Email Sent!</h3>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <p>Please check your inbox and follow the instructions to reset your password.</p>
              <div className="info-box">
                <p>Didn't receive the email? Check your spam folder or try again.</p>
              </div>
              <Link to="/login" className="btn btn-outline">
                <FaArrowLeft /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;