import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  FaUsers, 
  FaUserShield, 
  FaMoneyBillWave, 
  FaClipboardList,
  FaSchool,
  FaChartBar,
  FaCheckCircle,
  FaHourglassHalf,
  FaDownload
} from 'react-icons/fa';
import './Dashboard.css';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
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
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of KNAX250.</p>
          </div>
          <Link to="/super-admin/download-reports" className="btn btn-primary">
            <FaDownload /> Download Reports
          </Link>
        </div>

        {/* Main Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <FaMoneyBillWave className="stat-icon" />
            <div className="stat-info">
              <h3>{formatCurrency(stats?.totalEarnings || 0)}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
          <div className="stat-card dark">
            <FaClipboardList className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.totalRegistrations || 0}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
          <div className="stat-card success">
            <FaCheckCircle className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.approvedRegistrations || 0}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card warning">
            <FaHourglassHalf className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.pendingRegistrations || 0}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="secondary-stats">
          <div className="stat-box">
            <FaUserShield className="stat-box-icon" />
            <div>
              <h4>{stats?.juniorAdminsCount || 0}</h4>
              <p>Junior Admins</p>
            </div>
          </div>
          <div className="stat-box">
            <FaUsers className="stat-box-icon" />
            <div>
              <h4>{stats?.studentsCount || 0}</h4>
              <p>Registered Students</p>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className="department-stats card">
          <h2><FaChartBar /> Department Statistics</h2>
          <div className="dept-grid">
            {stats?.departmentStats?.length > 0 ? (
              stats.departmentStats.map((dept) => (
                <div key={dept._id} className="dept-card">
                  <h3>{dept._id}</h3>
                  <div className="dept-info">
                    <div className="dept-stat">
                      <span className="dept-number">{dept.count}</span>
                      <span className="dept-label">Students</span>
                    </div>
                    <div className="dept-stat">
                      <span className="dept-number">{formatCurrency(dept.earnings)}</span>
                      <span className="dept-label">Revenue</span>
                    </div>
                  </div>
                  <div className="dept-progress">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(dept.count / (stats?.approvedRegistrations || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No department data available yet</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links-section">
          <h2>Quick Actions</h2>
          <div className="quick-links-grid">
            <Link to="/super-admin/admins" className="quick-link">
              <FaUserShield />
              <span>Manage Admins</span>
            </Link>
            <Link to="/super-admin/schools" className="quick-link">
              <FaSchool />
              <span>Manage Schools</span>
            </Link>
            <Link to="/super-admin/registrations" className="quick-link">
              <FaClipboardList />
              <span>View Registrations</span>
            </Link>
            <Link to="/super-admin/finances" className="quick-link">
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