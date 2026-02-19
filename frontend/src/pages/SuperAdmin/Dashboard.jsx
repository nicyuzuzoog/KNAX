// pages/SuperAdmin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { 
  FaUsers, 
  FaUserShield, 
  FaMoneyBillWave, 
  FaClipboardList,
  FaSchool,
  FaChartBar,
  FaCheckCircle,
  FaHourglassHalf,
  FaDownload,
  FaBuilding,
  FaArrowUp
} from 'react-icons/fa';
import './Dashboard.css';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalRegistrations: 0,
    approvedRegistrations: 0,
    pendingRegistrations: 0,
    juniorAdminsCount: 0,
    studentsCount: 0,
    schoolsCount: 0,
    departmentStats: []
  });
  const [loading, setLoading] = useState(true);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, regsRes] = await Promise.all([
        api.get('/admin/dashboard-stats').catch(() => ({ data: null })),
        api.get('/registrations').catch(() => ({ data: [] }))
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      setRecentRegistrations(regsRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="super-admin-dashboard">
        <div className="page-header">
          <div>
            <h1>Super Admin Dashboard</h1>
            <p>Welcome back! Here's an overview of KNAX250.</p>
          </div>
          <Link to="/super-admin/download-reports" className="btn btn-primary">
            <FaDownload /> Download Reports
          </Link>
        </div>

        {/* Main Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon"><FaMoneyBillWave /></div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalEarnings)}</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className="stat-card dark">
            <div className="stat-icon"><FaClipboardList /></div>
            <div className="stat-info">
              <h3>{stats.totalRegistrations}</h3>
              <p>Total Registrations</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon"><FaCheckCircle /></div>
            <div className="stat-info">
              <h3>{stats.approvedRegistrations}</h3>
              <p>Approved</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon"><FaHourglassHalf /></div>
            <div className="stat-info">
              <h3>{stats.pendingRegistrations}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="secondary-stats">
          <div className="mini-stat">
            <FaUserShield className="mini-icon" />
            <div>
              <h4>{stats.juniorAdminsCount}</h4>
              <p>Junior Admins</p>
            </div>
          </div>
          <div className="mini-stat">
            <FaUsers className="mini-icon" />
            <div>
              <h4>{stats.studentsCount}</h4>
              <p>Students</p>
            </div>
          </div>
          <div className="mini-stat">
            <FaSchool className="mini-icon" />
            <div>
              <h4>{stats.schoolsCount}</h4>
              <p>Schools</p>
            </div>
          </div>
          <div className="mini-stat">
            <FaBuilding className="mini-icon" />
            <div>
              <h4>5</h4>
              <p>Departments</p>
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="recent-section card">
          <div className="section-header">
            <h2><FaClipboardList /> Recent Registrations</h2>
            <Link to="/super-admin/registrations" className="view-link">View All</Link>
          </div>
          
          {recentRegistrations.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>School</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>
                      <strong>{reg.student?.fullName}</strong>
                      <br /><small>{reg.student?.email}</small>
                    </td>
                    <td><span className={`badge ${reg.department?.toLowerCase()}`}>{reg.department}</span></td>
                    <td>{reg.school?.name}</td>
                    <td><span className={`status ${reg.paymentStatus}`}>{reg.paymentStatus}</span></td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FaClipboardList />
              <p>No registrations yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/super-admin/admins" className="action-card">
              <FaUserShield />
              <span>Manage Admins</span>
            </Link>
            <Link to="/super-admin/schools" className="action-card">
              <FaSchool />
              <span>Manage Schools</span>
            </Link>
            <Link to="/super-admin/registrations" className="action-card">
              <FaClipboardList />
              <span>View Registrations</span>
            </Link>
            <Link to="/super-admin/finances" className="action-card">
              <FaMoneyBillWave />
              <span>Financial Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;