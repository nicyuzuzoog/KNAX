// src/pages/JuniorAdmin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  FaClipboardList, 
  FaCalendarCheck, 
  FaUsers,
  FaCheckCircle,
  FaHourglassHalf,
  FaBuilding,
  FaTimesCircle,
  FaClock,
  FaBell,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaUserGraduate,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUserClock
} from 'react-icons/fa';
import './Dashboard.css';

const JuniorAdminDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [regsRes, attRes, annRes] = await Promise.allSettled([
        api.get('/registrations'),
        api.get('/attendance'),
        api.get('/announcements')
      ]);

      // Process registrations
      if (regsRes.status === 'fulfilled') {
        const allRegs = regsRes.value.data?.registrations || regsRes.value.data || [];
        // Filter by department if junior admin has a department
        const filtered = user?.department 
          ? allRegs.filter(r => r.department === user.department)
          : allRegs;
        setRegistrations(filtered);
      }

      // Process attendance
      if (attRes.status === 'fulfilled') {
        const attData = attRes.value.data?.attendance || attRes.value.data || [];
        setAttendance(attData);
      }

      // Process announcements
      if (annRes.status === 'fulfilled') {
        const annData = annRes.value.data?.announcements || annRes.value.data || [];
        setAnnouncements(annData.slice(0, 3));
      }

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.paymentStatus === 'pending').length,
    approved: registrations.filter(r => r.paymentStatus === 'approved').length,
    rejected: registrations.filter(r => r.paymentStatus === 'rejected').length,
    active: registrations.filter(r => r.internshipStatus === 'active').length
  };

  // Calculate earnings
  const totalEarnings = registrations
    .filter(r => r.paymentStatus === 'approved')
    .reduce((sum, r) => sum + (r.amountPaid || 30000), 0);

  const pendingAmount = stats.pending * 30000;

  // Today's attendance
  const today = new Date().toDateString();
  const todayAttendance = attendance.filter(a => new Date(a.date).toDateString() === today);

  // Get pending payments for quick view
  const pendingPayments = registrations
    .filter(r => r.paymentStatus === 'pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent registrations
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
            <p>Here's what's happening in your department today</p>
            {user?.department && (
              <span className="department-tag">
                <FaBuilding /> {user.department} Department
              </span>
            )}
          </div>
          <div className="welcome-stats">
            <div className="quick-stat">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Students</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{todayAttendance.filter(a => a.status === 'present').length}</span>
              <span className="stat-label">Present Today</span>
            </div>
          </div>
        </div>

        {/* Alert for Pending Payments */}
        {stats.pending > 0 && (user?.permissions?.canApprovePayments || user?.permissions?.canViewRegistrations) && (
          <div className="alert-banner warning">
            <FaExclamationTriangle />
            <div className="alert-content">
              <strong>{stats.pending} payment(s) pending review!</strong>
              <p>Students are waiting for their payment approval.</p>
            </div>
            <Link to="/admin/registrations?status=pending" className="btn btn-warning">
              Review Now
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <Link to="/admin/registrations" className="stat-card total">
            <div className="stat-icon"><FaClipboardList /></div>
            <div className="stat-details">
              <h3>{stats.total}</h3>
              <p>Total Registrations</p>
            </div>
          </Link>
          <Link to="/admin/registrations?status=pending" className="stat-card pending">
            <div className="stat-icon"><FaHourglassHalf /></div>
            <div className="stat-details">
              <h3>{stats.pending}</h3>
              <p>Pending Payments</p>
            </div>
            {stats.pending > 0 && <span className="stat-badge">{stats.pending}</span>}
          </Link>
          <Link to="/admin/registrations?status=approved" className="stat-card approved">
            <div className="stat-icon"><FaCheckCircle /></div>
            <div className="stat-details">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </Link>
          <Link to="/admin/registrations?status=rejected" className="stat-card rejected">
            <div className="stat-icon"><FaTimesCircle /></div>
            <div className="stat-details">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </Link>
        </div>

        {/* Financial Summary */}
        {(user?.permissions?.canApprovePayments || user?.permissions?.canViewFinancials) && (
          <div className="financial-summary">
            <div className="financial-card">
              <div className="financial-icon">
                <FaMoneyBillWave />
              </div>
              <div className="financial-details">
                <h3>{totalEarnings.toLocaleString()} RWF</h3>
                <p>Total Revenue (Approved)</p>
              </div>
            </div>
            <div className="financial-card pending-amount">
              <div className="financial-icon">
                <FaFileInvoiceDollar />
              </div>
              <div className="financial-details">
                <h3>{pendingAmount.toLocaleString()} RWF</h3>
                <p>Pending Amount</p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Attendance */}
        <div className="attendance-summary">
          <div className="section-header">
            <h2><FaCalendarCheck /> Today's Attendance</h2>
            {user?.permissions?.canManageAttendance && (
              <Link to="/admin/attendance" className="btn-link">Mark Attendance →</Link>
            )}
          </div>
          <div className="attendance-mini-stats">
            <div className="mini-stat present">
              <FaCheckCircle />
              <span>{todayAttendance.filter(a => a.status === 'present').length}</span>
              <p>Present</p>
            </div>
            <div className="mini-stat late">
              <FaClock />
              <span>{todayAttendance.filter(a => a.status === 'late').length}</span>
              <p>Late</p>
            </div>
            <div className="mini-stat absent">
              <FaTimesCircle />
              <span>{todayAttendance.filter(a => a.status === 'absent').length}</span>
              <p>Absent</p>
            </div>
          </div>
        </div>

        {/* Pending Payments Quick View */}
        {(user?.permissions?.canApprovePayments) && pendingPayments.length > 0 && (
          <div className="data-card highlight">
            <div className="card-header">
              <h2><FaMoneyBillWave /> Pending Payment Approvals</h2>
              <Link to="/admin/registrations?status=pending" className="btn-link">View All ({stats.pending}) →</Link>
            </div>
            <div className="card-body">
              <div className="pending-list">
                {pendingPayments.map((reg) => (
                  <div key={reg._id} className="pending-item">
                    <div className="pending-avatar">
                      {reg.student?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div className="pending-info">
                      <strong>{reg.student?.fullName || 'Unknown Student'}</strong>
                      <span>{reg.student?.email}</span>
                    </div>
                    <div className="pending-amount">
                      {(reg.amountPaid || 30000).toLocaleString()} RWF
                    </div>
                    <Link to={`/admin/registrations?id=${reg._id}`} className="btn btn-sm btn-primary">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Registrations */}
        <div className="data-card">
          <div className="card-header">
            <h2><FaClipboardList /> Recent Registrations</h2>
            {user?.permissions?.canViewRegistrations && (
              <Link to="/admin/registrations" className="btn-link">View All →</Link>
            )}
          </div>
          <div className="card-body">
            {recentRegistrations.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>School</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <div className="student-info">
                          <div className="avatar">{reg.student?.fullName?.charAt(0) || 'N'}</div>
                          <span>{reg.student?.fullName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span>{reg.student?.email}</span>
                          <small>{reg.student?.phone}</small>
                        </div>
                      </td>
                      <td>{reg.school?.name || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <FaUsers />
                <p>No registrations yet for {user?.department || 'your department'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        {announcements.length > 0 && (
          <div className="data-card">
            <div className="card-header">
              <h2><FaBell /> Recent Announcements</h2>
              <Link to="/admin/announcements" className="btn-link">View All →</Link>
            </div>
            <div className="card-body">
              <div className="announcements-list">
                {announcements.map((ann) => (
                  <div key={ann._id} className="announcement-item">
                    <div className={`announcement-priority ${ann.priority || 'normal'}`}></div>
                    <div className="announcement-content">
                      <h4>{ann.title}</h4>
                      <p>{ann.content?.substring(0, 100)}...</p>
                      <span className="announcement-date">
                        <FaClock /> {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {(user?.permissions?.canViewRegistrations || user?.permissions?.canApprovePayments) && (
              <Link to="/admin/registrations" className="action-card">
                <FaClipboardList />
                <span>Registrations</span>
                {stats.pending > 0 && <span className="action-badge">{stats.pending}</span>}
              </Link>
            )}
            {user?.permissions?.canApprovePayments && stats.pending > 0 && (
              <Link to="/admin/registrations?status=pending" className="action-card highlight">
                <FaMoneyBillWave />
                <span>Approve Payments</span>
                <span className="action-badge">{stats.pending}</span>
              </Link>
            )}
            {user?.permissions?.canManageAttendance && (
              <Link to="/admin/attendance" className="action-card">
                <FaCalendarCheck />
                <span>Attendance</span>
              </Link>
            )}
            {user?.permissions?.canManageTimetable && (
              <Link to="/admin/timetable" className="action-card">
                <FaCalendarAlt />
                <span>Timetable</span>
              </Link>
            )}
            {user?.permissions?.canManageShifts && (
              <Link to="/admin/shifts" className="action-card">
                <FaUserClock />
                <span>Shifts</span>
              </Link>
            )}
            {user?.permissions?.canPostAnnouncements && (
              <Link to="/admin/announcements" className="action-card">
                <FaBell />
                <span>Announcements</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JuniorAdminDashboard;