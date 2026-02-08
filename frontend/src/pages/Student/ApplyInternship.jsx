// pages/ApplyInternship/ApplyInternship.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaClipboardList,
  FaSchool,
  FaGraduationCap,
  FaBuilding,
  FaReceipt,
  FaUpload,
  FaCheck,
  FaInfoCircle,
  FaPhone,
  FaClock,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import './ApplyInternship.css';

const departments = [
  { id: 'NIT', name: 'Network & IT', icon: '🌐', description: 'Learn networking, cybersecurity, and IT infrastructure' },
  { id: 'SOD', name: 'Software Development', icon: '💻', description: 'Master programming, web & mobile development' },
  { id: 'ACCOUNTING', name: 'Accounting', icon: '📊', description: 'Financial management and bookkeeping' },
  { id: 'CSA', name: 'Computer Systems Administration', icon: '🖥️', description: 'System administration and hardware maintenance' },
  { id: 'ETE', name: 'Electronics & Telecommunications', icon: '📡', description: 'Electronics repair and telecom systems' }
];

const shifts = [
  { id: 'morning', name: 'Morning Shift', time: '8:00 AM - 12:00 PM', icon: <FaSun /> },
  { id: 'afternoon', name: 'Afternoon Shift', time: '2:00 PM - 6:00 PM', icon: <FaMoon /> }
];

const ApplyInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    schoolId: '',
    classId: '',
    parentPhone: '',
    shift: '',
    receipt: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter schools when department changes
  useEffect(() => {
    if (formData.department && schools.length > 0) {
      const filtered = schools.filter(school => 
        school.departments && school.departments.includes(formData.department)
      );
      setFilteredSchools(filtered);
      
      // Reset school and class if current selection doesn't have the department
      if (formData.schoolId) {
        const currentSchool = schools.find(s => s._id === formData.schoolId);
        if (currentSchool && !currentSchool.departments?.includes(formData.department)) {
          setFormData(prev => ({ ...prev, schoolId: '', classId: '' }));
          setClasses([]);
        }
      }
    } else {
      setFilteredSchools([]);
    }
  }, [formData.department, schools]);

  const fetchInitialData = async () => {
    try {
      const [schoolsRes, regRes] = await Promise.all([
        api.get('/schools'),
        api.get('/registrations/my-registration')
      ]);
      setSchools(schoolsRes.data);
      setExistingRegistration(regRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchClasses = async (schoolId) => {
    try {
      const response = await api.get(`/schools/${schoolId}/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setFormData({ ...formData, schoolId, classId: '' });
    if (schoolId) {
      fetchClasses(schoolId);
    } else {
      setClasses([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, receipt: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(07[2-9]\d{7}|078\d{7})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.department || !formData.schoolId || !formData.classId || !formData.receipt) {
      toast.error('Please fill in all fields and upload receipt');
      return;
    }

    if (!formData.parentPhone) {
      toast.error('Please enter parent/guardian phone number');
      return;
    }

    if (!validatePhone(formData.parentPhone)) {
      toast.error('Please enter a valid Rwandan phone number (07X XXX XXXX)');
      return;
    }

    if (!formData.shift) {
      toast.error('Please select your preferred shift');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('department', formData.department);
      submitData.append('schoolId', formData.schoolId);
      submitData.append('classId', formData.classId);
      submitData.append('parentPhone', formData.parentPhone.replace(/\s/g, ''));
      submitData.append('shift', formData.shift);
      submitData.append('receipt', formData.receipt);

      await api.post('/registrations', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Application submitted successfully! Wait for admin approval.');
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
    if (step === 2 && (!formData.schoolId || !formData.classId)) {
      toast.error('Please select school and class');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  if (loadingData) {
    return <Loader />;
  }

  if (existingRegistration) {
    return (
      <div className="apply-page">
        <div className="apply-container">
          <div className="already-registered card">
            <FaCheck className="success-icon" />
            <h2>Already Registered</h2>
            <p>You have already applied for an internship.</p>
            <div className="reg-info">
              <p><strong>Department:</strong> {existingRegistration.department}</p>
              <p><strong>Shift:</strong> {existingRegistration.shift || 'Not specified'}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${existingRegistration.paymentStatus}`}>
                  {existingRegistration.paymentStatus}
                </span>
              </p>
            </div>
            {existingRegistration.paymentStatus === 'pending' && (
              <div className="pending-notice">
                <FaClock />
                <p>Your application is being reviewed. You will receive a notification once approved.</p>
              </div>
            )}
            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="apply-page">
      <div className="apply-container">
        <div className="apply-header">
          <h1><FaClipboardList /> Apply for Internship</h1>
          <p>Complete the form below to register for an internship program</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Department</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>School & Class</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Details & Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="apply-form card">
          {/* Step 1: Select Department */}
          {step === 1 && (
            <div className="form-step">
              <h2><FaBuilding /> Select Department</h2>
              <p className="step-description">Choose the internship program you want to join</p>
              
              <div className="department-grid">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className={`department-option ${formData.department === dept.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, department: dept.id })}
                  >
                    <span className="dept-icon">{dept.icon}</span>
                    <h3>{dept.name}</h3>
                    <p className="dept-description">{dept.description}</p>
                    <p className="dept-id">{dept.id}</p>
                    {formData.department === dept.id && (
                      <div className="selected-check"><FaCheck /></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-buttons">
                <button type="button" onClick={nextStep} className="btn btn-primary">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select School & Class */}
          {step === 2 && (
            <div className="form-step">
              <h2><FaSchool /> Select School & Class</h2>
              <p className="step-description">
                Choose from schools that offer <strong>{formData.department}</strong> program
              </p>

              <div className="form-group">
                <label><FaSchool /> School</label>
                <select
                  value={formData.schoolId}
                  onChange={handleSchoolChange}
                  required
                >
                  <option value="">-- Select School --</option>
                  {filteredSchools.map((school) => (
                    <option key={school._id} value={school._id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                {filteredSchools.length === 0 && formData.department && (
                  <p className="field-hint warning">
                    No schools available for {formData.department}. Please contact admin.
                  </p>
                )}
              </div>

              <div className="form-group">
                <label><FaGraduationCap /> Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                  disabled={!formData.schoolId}
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {filteredSchools.length === 0 && formData.department && (
                <div className="info-box warning">
                  <FaInfoCircle />
                  <p>No schools offer the <strong>{formData.department}</strong> program. Please contact the admin or select a different department.</p>
                </div>
              )}

              <div className="form-buttons">
                <button type="button" onClick={prevStep} className="btn btn-outline">
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="btn btn-primary"
                  disabled={filteredSchools.length === 0}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info, Shift & Payment */}
          {step === 3 && (
            <div className="form-step">
              <h2><FaReceipt /> Contact, Shift & Payment</h2>
              <p className="step-description">Complete your registration details and upload payment receipt</p>

              {/* Parent/Guardian Phone */}
              <div className="form-section">
                <h3><FaPhone /> Parent/Guardian Contact</h3>
                <div className="form-group">
                  <label>Parent/Guardian Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="07X XXX XXXX"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    required
                  />
                  <p className="field-hint">We will contact this number for updates about your internship</p>
                </div>
              </div>

              {/* Shift Selection */}
              <div className="form-section">
                <h3><FaClock /> Select Preferred Shift *</h3>
                <div className="shift-options">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`shift-option ${formData.shift === shift.id ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, shift: shift.id })}
                    >
                      <div className="shift-icon">{shift.icon}</div>
                      <div className="shift-info">
                        <h4>{shift.name}</h4>
                        <p>{shift.time}</p>
                      </div>
                      {formData.shift === shift.id && (
                        <div className="selected-check"><FaCheck /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="form-section">
                <h3><FaReceipt /> Payment Information</h3>
                <div className="payment-info">
                  <div className="payment-amount">
                    <span className="amount-label">Registration Fee</span>
                    <span className="amount-value">30,000 RWF</span>
                  </div>
                  <div className="payment-instructions">
                    <h4>Payment Instructions:</h4>
                    <ol>
                      <li>Pay <strong>30,000 RWF</strong> via Mobile Money or Bank Transfer</li>
                      <li>MoMo Pay: <strong>0782562906</strong> (KNAX250 TECHNOLOGY)</li>
                      <li>Take a clear screenshot or photo of your payment receipt</li>
                      <li>Upload the receipt image below</li>
                      <li>Wait for admin approval (usually within 24-48 hours)</li>
                    </ol>
                  </div>
                </div>

                <div className="form-group">
                  <label><FaUpload /> Upload Receipt Photo *</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                    />
                    <label htmlFor="receipt" className="file-upload-label">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Receipt preview" className="receipt-preview" />
                      ) : (
                        <>
                          <FaUpload className="upload-icon" />
                          <span>Click to upload or drag and drop</span>
                          <span className="file-hint">PNG, JPG, PDF up to 5MB</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Application Summary */}
              <div className="application-summary">
                <h4>Application Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Department:</span>
                    <strong>{formData.department}</strong>
                  </div>
                  <div className="summary-item">
                    <span>School:</span>
                    <strong>{filteredSchools.find(s => s._id === formData.schoolId)?.name || '-'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Class:</span>
                    <strong>{classes.find(c => c._id === formData.classId)?.name || '-'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Shift:</span>
                    <strong>{shifts.find(s => s.id === formData.shift)?.name || '-'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Parent Phone:</span>
                    <strong>{formData.parentPhone || '-'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Amount:</span>
                    <strong>30,000 RWF</strong>
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" onClick={prevStep} className="btn btn-outline">
                  Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplyInternship;