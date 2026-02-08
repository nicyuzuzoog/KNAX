// pages/Student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  FaHome,
  FaClipboardList, 
  FaCalendarCheck, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserGraduate,
  FaBuilding,
  FaBook,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaTasks,
  FaBell,
  FaGraduationCap
} from 'react-icons/fa';
import './Dashboard.css';

// Department images
const departmentImages = {
  SOD: '/uploads/departments/sod.jpg',
  CSA: '/uploads/departments/csa.jpg',
  ACCOUNTING: '/uploads/departments/accounting.jpg',
  NIT: '/uploads/departments/nit.jpg',
  ETE: '/uploads/departments/ete.jpg'
};

const fallbackImages = {
  SOD: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
  CSA: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  ACCOUNTING: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  NIT: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
  ETE: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600'
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const fetchData = async () => {
    try {
      const [regRes, attRes] = await Promise.all([
        api.get('/registrations/my-registration'),
        api.get('/attendance/my-attendance')
      ]);
      setRegistration(regRes.data);
      setAttendance(attRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Clean menu items - Only essential items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'registration', label: 'Registration', icon: FaClipboardList },
    { id: 'attendance', label: 'Attendance', icon: FaCalendarCheck },
    { id: 'homeworks', label: 'Homeworks', icon: FaTasks },
    { id: 'timetable', label: 'Timetable', icon: FaClock },
    { divider: true },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`student-dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaGraduationCap />
            <span>KNAX Student</span>
          </div>
          <button 
            className="sidebar-toggle desktop-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <button 
            className="sidebar-toggle mobile-toggle"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h4>{user?.fullName}</h4>
            <span>{registration?.department || 'Student'}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            item.divider ? (
              <div key={index} className="nav-divider"></div>
            ) : (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars />
          </button>
          <div className="header-title">
            <h1>{menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}</h1>
          </div>
          <div className="header-actions">
            <button className="header-btn notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="header-user">
              <span>{user?.fullName}</span>
              <div className="user-avatar-small">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeSection === 'overview' && (
            <OverviewSection 
              user={user} 
              registration={registration} 
              attendance={attendance}
              fallbackImages={fallbackImages}
              departmentImages={departmentImages}
            />
          )}
          {activeSection === 'profile' && (
            <ProfileSection user={user} />
          )}
          {activeSection === 'registration' && (
            <RegistrationSection 
              registration={registration}
              fallbackImages={fallbackImages}
              departmentImages={departmentImages}
            />
          )}
          {activeSection === 'attendance' && (
            <AttendanceSection attendance={attendance} />
          )}
          {activeSection === 'homeworks' && (
            <HomeworksSection registration={registration} />
          )}
          {activeSection === 'timetable' && (
            <TimetableSection registration={registration} />
          )}
          {activeSection === 'settings' && (
            <SettingsSection user={user} />
          )}
        </div>
      </main>
    </div>
  );
};

// ============================================
// OVERVIEW SECTION
// ============================================
const OverviewSection = ({ user, registration, attendance, fallbackImages, departmentImages }) => {
  const today = new Date();
  const currentDept = registration?.department || user?.department;

  const calculateAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    return { total, present, absent, late, percentage };
  };

  const stats = calculateAttendanceStats();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success"><FaCheckCircle /> Approved</span>;
      case 'rejected':
        return <span className="badge badge-error"><FaTimesCircle /> Rejected</span>;
      case 'pending':
        return <span className="badge badge-warning"><FaHourglassHalf /> Pending</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div className="overview-section">
      {/* Welcome Banner */}
      <div 
        className="welcome-banner"
        style={{
          backgroundImage: currentDept 
            ? `linear-gradient(rgba(25, 118, 210, 0.9), rgba(13, 71, 161, 0.95)), url(${departmentImages[currentDept] || fallbackImages[currentDept]})`
            : 'linear-gradient(135deg, #1976D2, #0D47A1)'
        }}
      >
        <div className="welcome-text">
          <h1>Welcome back, {user?.fullName}! 👋</h1>
          <p>Track your internship progress and stay updated</p>
          {currentDept && (
            <div className="dept-badge-large">
              <FaBuilding /> {currentDept} Department
            </div>
          )}
        </div>
        <div className="welcome-date">
          <span className="date-day">{today.getDate()}</span>
          <div className="date-details">
            <span className="date-month">{today.toLocaleDateString('en-US', { month: 'long' })}</span>
            <span className="date-year">{today.getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {registration?.paymentStatus === 'approved' && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon-wrapper">
              <FaCalendarCheck />
            </div>
            <div className="stat-info">
              <h3>{stats.percentage}%</h3>
              <p>Attendance Rate</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon-wrapper">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.present}</h3>
              <p>Days Present</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon-wrapper">
              <FaClock />
            </div>
            <div className="stat-info">
              <h3>{stats.late}</h3>
              <p>Days Late</p>
            </div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon-wrapper">
              <FaTimesCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.absent}</h3>
              <p>Days Absent</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Status Card */}
      {registration ? (
        <div className="overview-card registration-overview">
          <div className="card-header">
            <h2><FaClipboardList /> Registration Status</h2>
            {getStatusBadge(registration.paymentStatus)}
          </div>
          <div className="card-body">
            <div className="reg-overview-grid">
              <div className="reg-item">
                <FaBuilding className="reg-icon" />
                <div>
                  <span className="reg-label">Department</span>
                  <span className="reg-value">{registration.department}</span>
                </div>
              </div>
              <div className="reg-item">
                <FaGraduationCap className="reg-icon" />
                <div>
                  <span className="reg-label">School</span>
                  <span className="reg-value">{registration.school?.name || 'N/A'}</span>
                </div>
              </div>
              <div className="reg-item">
                <FaBook className="reg-icon" />
                <div>
                  <span className="reg-label">Class</span>
                  <span className="reg-value">{registration.class?.name || 'N/A'}</span>
                </div>
              </div>
              <div className="reg-item">
                <FaCalendarCheck className="reg-icon" />
                <div>
                  <span className="reg-label">Applied On</span>
                  <span className="reg-value">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {registration.paymentStatus === 'pending' && (
              <div className="pending-alert">
                <FaHourglassHalf />
                <p>Your payment is being reviewed. You'll receive an email once approved!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="overview-card no-registration-card">
          <div className="no-reg-content">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" 
              alt="Join us"
            />
            <h2>Start Your Journey Today!</h2>
            <p>You haven't applied for an internship yet. Join KNAX_250 TECHNOLOGY Ltd and transform your future!</p>
            <div className="no-reg-features">
              <span><FaCheckCircle /> RTB Certified</span>
              <span><FaCheckCircle /> Free WiFi</span>
              <span><FaCheckCircle /> Job Placement</span>
            </div>
            <Link to="/student/apply" className="btn btn-primary btn-lg">
              Apply for Internship - 30,000 RWF
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {registration?.paymentStatus === 'approved' && attendance.length > 0 && (
        <div className="overview-card">
          <div className="card-header">
            <h2><FaCalendarCheck /> Recent Attendance</h2>
          </div>
          <div className="card-body">
            <div className="recent-attendance-list">
              {attendance.slice(0, 5).map((record) => (
                <div key={record._id} className="attendance-item">
                  <div className="attendance-date">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <span className={`status-badge ${record.status}`}>
                    {record.status}
                  </span>
                  <div className="attendance-time">
                    {record.checkInTime || '--:--'} - {record.checkOutTime || '--:--'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// PROFILE SECTION
// ============================================
const ProfileSection = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/update-profile', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title">
            <h2>{user?.fullName}</h2>
            <span className="profile-role">{user?.role === 'student' ? 'Student' : user?.role}</span>
          </div>
          <button 
            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label><FaUser /> Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label><FaPhone /> Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label><FaUserGraduate /> Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password Card */}
      <ChangePasswordCard />
    </div>
  );
};

// ============================================
// CHANGE PASSWORD CARD
// ============================================
const ChangePasswordCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      return;
    }

    setLoading(true);

    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowForm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-card">
      <div className="card-header">
        <h2><FaLock /> Password & Security</h2>
        <button 
          className="btn btn-outline"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Change Password'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Changing...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

// ============================================
// REGISTRATION SECTION
// ============================================
const RegistrationSection = ({ registration, fallbackImages, departmentImages }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success"><FaCheckCircle /> Approved</span>;
      case 'rejected':
        return <span className="badge badge-error"><FaTimesCircle /> Rejected</span>;
      case 'pending':
        return <span className="badge badge-warning"><FaHourglassHalf /> Pending</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  if (!registration) {
    return (
      <div className="registration-section">
        <div className="no-registration-card">
          <div className="no-reg-icon">
            <FaClipboardList />
          </div>
          <h2>No Registration Found</h2>
          <p>You haven't applied for an internship yet. Start your journey now!</p>
          <Link to="/student/apply" className="btn btn-primary btn-lg">
            Apply for Internship
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-section">
      <div className="registration-detail-card">
        <div className="reg-header">
          <div className="reg-dept-image">
            <img 
              src={departmentImages[registration.department] || fallbackImages[registration.department]}
              alt={registration.department}
              onError={(e) => { e.target.src = fallbackImages[registration.department]; }}
            />
          </div>
          <div className="reg-header-info">
            <h2>{registration.department} Department</h2>
            {getStatusBadge(registration.paymentStatus)}
          </div>
        </div>

        <div className="reg-details-grid">
          <div className="detail-card">
            <FaGraduationCap className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">School</span>
              <span className="detail-value">{registration.school?.name || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <FaBook className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Class</span>
              <span className="detail-value">{registration.class?.name || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <FaCalendarCheck className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Applied On</span>
              <span className="detail-value">
                {new Date(registration.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <FaClock className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Internship Status</span>
              <span className="detail-value">{registration.internshipStatus || 'Pending'}</span>
            </div>
          </div>

          {registration.startDate && (
            <div className="detail-card">
              <FaCalendarCheck className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">
                  {new Date(registration.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {registration.endDate && (
            <div className="detail-card">
              <FaCalendarCheck className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">End Date</span>
                <span className="detail-value">
                  {new Date(registration.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {registration.paymentStatus === 'pending' && (
          <div className="pending-notice">
            <FaHourglassHalf />
            <div>
              <h4>Payment Under Review</h4>
              <p>Your payment receipt is being reviewed by our team. You will receive an email notification once approved.</p>
            </div>
          </div>
        )}

        {registration.paymentStatus === 'rejected' && (
          <div className="rejected-notice">
            <FaTimesCircle />
            <div>
              <h4>Registration Rejected</h4>
              <p>Unfortunately, your registration was rejected. Please contact support for more information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// ATTENDANCE SECTION
// ============================================
const AttendanceSection = ({ attendance }) => {
  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    return { total, present, absent, late, percentage };
  };

  const stats = calculateStats();

  return (
    <div className="attendance-section">
      {/* Attendance Stats */}
      <div className="attendance-stats-grid">
        <div className="att-stat-card total">
          <h3>{stats.total}</h3>
          <p>Total Days</p>
        </div>
        <div className="att-stat-card present">
          <h3>{stats.present}</h3>
          <p>Present</p>
        </div>
        <div className="att-stat-card late">
          <h3>{stats.late}</h3>
          <p>Late</p>
        </div>
        <div className="att-stat-card absent">
          <h3>{stats.absent}</h3>
          <p>Absent</p>
        </div>
        <div className="att-stat-card percentage">
          <h3>{stats.percentage}%</h3>
          <p>Attendance Rate</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-card">
        <div className="card-header">
          <h2><FaCalendarCheck /> Attendance History</h2>
        </div>
        
        {attendance.length > 0 ? (
          <div className="table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status === 'present' && <FaCheckCircle />}
                        {record.status === 'late' && <FaClock />}
                        {record.status === 'absent' && <FaTimesCircle />}
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkInTime || '--:--'}</td>
                    <td>{record.checkOutTime || '--:--'}</td>
                    <td>{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <FaCalendarCheck />
            <p>No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// HOMEWORKS SECTION
// ============================================
const HomeworksSection = ({ registration }) => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const res = await api.get('/homeworks/my-homeworks');
      setHomeworks(res.data);
    } catch (error) {
      console.error('Error fetching homeworks:', error);
      // Demo data
      setHomeworks([
        {
          _id: '1',
          title: 'JavaScript Fundamentals Assignment',
          description: 'Complete exercises 1-10 from the JavaScript basics module',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          subject: 'Programming'
        },
        {
          _id: '2',
          title: 'Database Design Project',
          description: 'Design a database schema for an e-commerce application',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'pending',
          subject: 'Database'
        },
        {
          _id: '3',
          title: 'UI/UX Case Study',
          description: 'Analyze and present a case study on mobile app design',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'submitted',
          subject: 'Design'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status, dueDate) => {
    if (status === 'submitted') return 'submitted';
    if (status === 'graded') return 'graded';
    if (new Date(dueDate) < new Date()) return 'overdue';
    return 'pending';
  };

  const filteredHomeworks = filter === 'all' 
    ? homeworks 
    : homeworks.filter(hw => {
        if (filter === 'pending') return hw.status === 'pending';
        if (filter === 'submitted') return hw.status === 'submitted';
        if (filter === 'overdue') return hw.status === 'pending' && new Date(hw.dueDate) < new Date();
        return true;
      });

  if (loading) return <Loader />;

  return (
    <div className="homeworks-section">
      {/* Filter Tabs */}
      <div className="homework-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({homeworks.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
          onClick={() => setFilter('submitted')}
        >
          Submitted
        </button>
        <button 
          className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          Overdue
        </button>
      </div>

      {/* Homeworks List */}
      <div className="homeworks-list">
        {filteredHomeworks.length > 0 ? (
          filteredHomeworks.map((homework) => (
            <div 
              key={homework._id} 
              className={`homework-card ${getStatusClass(homework.status, homework.dueDate)}`}
            >
              <div className="homework-header">
                <div className="homework-subject">{homework.subject}</div>
                <span className={`homework-status ${getStatusClass(homework.status, homework.dueDate)}`}>
                  {homework.status === 'submitted' ? 'Submitted' : 
                   new Date(homework.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                </span>
              </div>
              <h3>{homework.title}</h3>
              <p>{homework.description}</p>
              <div className="homework-footer">
                <div className="due-date">
                  <FaClock />
                  Due: {new Date(homework.dueDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {homework.status === 'pending' && (
                  <button className="btn btn-primary btn-sm">
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <FaTasks />
            <p>No homeworks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// TIMETABLE SECTION
// ============================================
const TimetableSection = ({ registration }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay, registration]);

  const fetchTimetable = async () => {
    if (!registration?.department) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/timetable?department=${registration.department}&day=${selectedDay}`);
      setTimetable(res.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // Demo data
      setTimetable([
        {
          _id: '1',
          subject: 'Web Development',
          startTime: '08:00',
          endTime: '10:00',
          instructor: 'Mr. John Doe',
          room: 'Lab 1',
          shift: 'morning'
        },
        {
          _id: '2',
          subject: 'Database Management',
          startTime: '10:30',
          endTime: '12:30',
          instructor: 'Ms. Jane Smith',
          room: 'Lab 2',
          shift: 'morning'
        },
        {
          _id: '3',
          subject: 'Project Work',
          startTime: '14:00',
          endTime: '16:00',
          instructor: 'Mr. Peter Jones',
          room: 'Lab 1',
          shift: 'afternoon'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="timetable-section">
      {/* Day Selector */}
      <div className="day-selector">
        {days.map((day, index) => (
          <button
            key={index}
            className={`day-btn ${selectedDay === index ? 'active' : ''}`}
            onClick={() => setSelectedDay(index)}
          >
            <span className="day-short">{day.substring(0, 3)}</span>
            <span className="day-full">{day}</span>
          </button>
        ))}
      </div>

      {/* Timetable Content */}
      <div className="timetable-content">
        <h2>{days[selectedDay]}'s Schedule</h2>
        
        {timetable.length > 0 ? (
          <div className="timetable-list">
            {timetable.map((item) => (
              <div key={item._id} className={`timetable-item ${item.shift}`}>
                <div className="time-column">
                  <span className="time-start">{item.startTime}</span>
                  <div className="time-divider"></div>
                  <span className="time-end">{item.endTime}</span>
                </div>
                <div className="subject-column">
                  <h4>{item.subject}</h4>
                  {item.instructor && <p className="instructor">👨‍🏫 {item.instructor}</p>}
                  {item.room && <p className="room">📍 {item.room}</p>}
                </div>
                <span className={`shift-tag ${item.shift}`}>
                  {item.shift}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <FaClock />
            <p>No classes scheduled for {days[selectedDay]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SETTINGS SECTION
// ============================================
const SettingsSection = ({ user }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  return (
    <div className="settings-section">
      <div className="settings-card">
        <h2><FaCog /> Account Settings</h2>
        
        {/* Notification Settings */}
        <div className="settings-group">
          <h3>Notification Preferences</h3>
          <div className="settings-options">
            <label className="setting-option">
              <span>
                <FaEnvelope /> Email Notifications
                <small>Receive updates via email</small>
              </span>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
              />
            </label>
            <label className="setting-option">
              <span>
                <FaPhone /> SMS Notifications
                <small>Receive SMS alerts</small>
              </span>
              <input 
                type="checkbox" 
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
              />
            </label>
            <label className="setting-option">
              <span>
                <FaBell /> Push Notifications
                <small>Browser push notifications</small>
              </span>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
              />
            </label>
          </div>
        </div>

        {/* Account Info */}
        <div className="settings-group">
          <h3>Account Information</h3>
          <div className="account-info">
            <div className="info-row">
              <span>Account Created:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="info-row">
              <span>Account Type:</span>
              <span>{user?.role}</span>
            </div>
            <div className="info-row">
              <span>Status:</span>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-group danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;