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
  FaBuilding
} from 'react-icons/fa';
import './Dashboard.css';

const JuniorAdminDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.paymentStatus === 'pending').length,
    approved: registrations.filter(r => r.paymentStatus === 'approved').length,
    active: registrations.filter(r => r.internshipStatus === 'active').length
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="junior-dashboard">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div>
            <h1>Welcome, {user?.fullName}!</h1>
            <p><FaBuilding /> Department: <strong>{user?.department}</strong></p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <FaClipboardList className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
          <div className="stat-card warning">
            <FaHourglassHalf className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card success">
            <FaCheckCircle className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card dark">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.active}</h3>
              <p>Active Interns</p>
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="recent-section card">
          <div className="section-header">
            <h2><FaClipboardList /> Recent Registrations</h2>
            {user?.permissions?.canViewRegistrations && (
              <Link to="/admin/registrations" className="btn btn-outline btn-sm">
                View All
              </Link>
            )}
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.slice(0, 5).map((reg) => (
                  <tr key={reg._id}>
                    <td>{reg.student?.fullName}</td>
                    <td>{reg.school?.name}</td>
                    <td>{reg.class?.name}</td>
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {user?.permissions?.canViewRegistrations && (
              <Link to="/admin/registrations" className="action-card">
                <FaClipboardList />
                <span>Manage Registrations</span>
              </Link>
            )}
            {user?.permissions?.canManageAttendance && (
              <Link to="/admin/attendance" className="action-card">
                <FaCalendarCheck />
                <span>Mark Attendance</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JuniorAdminDashboard;