// src/pages/Student/ApplyInternship.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FaBuilding,
  FaSchool,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaInfoCircle,
  FaGraduationCap,
  FaUserGraduate,
  FaMoneyBillWave
} from 'react-icons/fa';
import './ApplyInternship.css';

const ApplyInternship = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    department: '',
    school: '',
    parentPhone: '',
    shift: ''
  });

  const departments = [
    { id: 'SOD', name: 'Software Development', icon: '💻', description: 'Web & Mobile Development', color: '#3b82f6' },
    { id: 'NIT', name: 'Networking & IT', icon: '🌐', description: 'Infrastructure & Security', color: '#10b981' },
    { id: 'ACCOUNTING', name: 'Accounting', icon: '📊', description: 'Financial Management', color: '#f59e0b' },
    { id: 'CSA', name: 'Computer Systems Administration', icon: '🖥️', description: 'System Administration', color: '#8b5cf6' },
    { id: 'ETE', name: 'Electronics & Telecommunications', icon: '📡', description: 'Electronics Repair', color: '#ef4444' }
  ];

  const shifts = [
    { id: 'morning', name: 'Morning Shift', time: '8:00 AM - 12:00 PM', icon: '🌅', description: 'Perfect for early birds' },
    { id: 'afternoon', name: 'Afternoon Shift', time: '2:00 PM - 6:00 PM', icon: '🌇', description: 'Ideal for flexible schedules' }
  ];

  useEffect(() => {
    fetchSchools();
    checkExistingRegistration();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await api.get('/schools');
      setSchools(res.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      // Demo schools if API fails
      setSchools([
        { _id: '1', name: 'Lycée de Kigali' },
        { _id: '2', name: 'College Saint André' },
        { _id: '3', name: 'IPRC Kigali' },
        { _id: '4', name: 'GS Remera' }
      ]);
    }
  };

  const checkExistingRegistration = async () => {
    try {
      const res = await api.get('/registrations/my-registration');
      if (res.data) {
        toast.info('You already have an active registration');
        navigate('/student/dashboard');
      }
    } catch (error) {
      // No existing registration - OK to proceed
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.department || !formData.school || !formData.parentPhone || !formData.shift) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate phone
    if (!/^07[0-9]{8}$/.test(formData.parentPhone)) {
      toast.error('Please enter a valid Rwandan phone number (07XXXXXXXX)');
      return;
    }

    setLoading(true);

    try {
      await api.post('/registrations/apply', {
        department: formData.department,
        school: formData.school,
        parentPhone: formData.parentPhone,
        shift: formData.shift
      });

      toast.success('Application submitted successfully! Please pay the registration fee and wait for approval.');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.department) {
      toast.error('Please select a department');
      return;
    }
    if (step === 2 && !formData.shift) {
      toast.error('Please select a shift');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const totalSteps = 3;

  return (
    <div className="apply-page">
      {/* Back Button */}
      <Link to="/student/dashboard" className="back-button">
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <div className="apply-container">
        {/* Header */}
        <div className="apply-header">
          <div className="header-icon">
            <FaGraduationCap />
          </div>
          <h1>Apply for Internship</h1>
          <p>Join KNAX_250 TECHNOLOGY Ltd and transform your future</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`progress-step ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
              <div className="step-circle">
                {step > num ? <FaCheckCircle /> : num}
              </div>
              <span className="step-label">
                {num === 1 && 'Department'}
                {num === 2 && 'Shift'}
                {num === 3 && 'Details'}
              </span>
              {num < totalSteps && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="apply-form">
          
          {/* Step 1: Department */}
          {step === 1 && (
            <div className="form-step animate-in">
              <div className="step-header">
                <FaBuilding className="step-icon" />
                <h2>Select Your Department</h2>
                <p>Choose the field you want to specialize in</p>
              </div>
              <div className="department-grid">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className={`department-card ${formData.department === dept.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, department: dept.id })}
                    style={{ '--card-color': dept.color }}
                  >
                    <span className="dept-icon">{dept.icon}</span>
                    <h3>{dept.name}</h3>
                    <p>{dept.description}</p>
                    {formData.department === dept.id && (
                      <div className="check-badge">
                        <FaCheckCircle />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Shift */}
          {step === 2 && (
            <div className="form-step animate-in">
              <div className="step-header">
                <FaClock className="step-icon" />
                <h2>Select Your Shift</h2>
                <p>Choose the time that works best for you</p>
              </div>
              <div className="shift-grid">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className={`shift-card ${formData.shift === shift.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, shift: shift.id })}
                  >
                    <span className="shift-icon">{shift.icon}</span>
                    <h3>{shift.name}</h3>
                    <p className="shift-time">{shift.time}</p>
                    <p className="shift-desc">{shift.description}</p>
                    {formData.shift === shift.id && (
                      <div className="check-badge">
                        <FaCheckCircle />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details & Summary */}
          {step === 3 && (
            <div className="form-step animate-in">
              <div className="step-header">
                <FaUserGraduate className="step-icon" />
                <h2>Complete Your Application</h2>
                <p>Fill in the remaining details and review your application</p>
              </div>
              
              <div className="form-fields">
                <div className="form-group">
                  <label><FaSchool /> School *</label>
                  <select
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select your school...</option>
                    {schools.map((school) => (
                      <option key={school._id} value={school._id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label><FaPhone /> Parent/Guardian Phone *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    required
                    className="form-input"
                  />
                  <small className="form-hint">Enter a valid Rwandan phone number</small>
                </div>
              </div>

              {/* Application Summary */}
              <div className="application-summary">
                <h3>📋 Application Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Department</span>
                    <span className="summary-value">
                      {departments.find(d => d.id === formData.department)?.name || 'Not selected'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Shift</span>
                    <span className="summary-value">
                      {shifts.find(s => s.id === formData.shift)?.name || 'Not selected'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Applicant</span>
                    <span className="summary-value">{user?.fullName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Email</span>
                    <span className="summary-value">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="payment-notice">
                <div className="notice-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="notice-content">
                  <h4>Registration Fee: 30,000 RWF</h4>
                  <p>After submitting your application, please pay the registration fee to:</p>
                  <div className="payment-methods">
                    <div className="payment-method">
                      <strong>MoMo:</strong> 0782562906 (Jean Baptiste NDUWINGOMA)
                    </div>
                    <div className="payment-method">
                      <strong>Bank:</strong> Bank of Kigali - 100XXXXXXX
                    </div>
                  </div>
                  <p className="notice-note">
                    <FaInfoCircle /> A Junior Admin will verify your payment and approve your registration.
                    You will receive an email notification once approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                <FaArrowLeft /> Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Continue <FaArrowRight />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading || !formData.school || !formData.parentPhone}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span> Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternship;