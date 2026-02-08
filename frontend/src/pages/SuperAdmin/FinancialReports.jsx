import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendar,
  FaDownload,
  FaUsers
} from 'react-icons/fa';
import './FinancialReports.css';

const FinancialReports = () => {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, regRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/registrations?status=approved')
      ]);
      setStats(statsRes.data);
      setRegistrations(regRes.data);
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
      <div className="financial-page">
        <div className="page-header">
          <div>
            <h1><FaMoneyBillWave /> Financial Reports</h1>
            <p>Track earnings and revenue statistics</p>
          </div>
          <Link to="/super-admin/download-reports" className="btn btn-primary">
            <FaDownload /> Download Reports
          </Link>
        </div>

        {/* Total Earnings */}
        <div className="earnings-banner">
          <div className="earnings-content">
            <FaMoneyBillWave className="earnings-icon" />
            <div>
              <span className="earnings-label">Total Earnings (All Time)</span>
              <h2>{formatCurrency(stats?.totalEarnings || 0)}</h2>
              <span className="earnings-count">
                From {stats?.approvedRegistrations || 0} approved registrations
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="finance-stats-row">
          <div className="finance-stat-card">
            <FaUsers />
            <div>
              <h3>{formatCurrency(30000)}</h3>
              <p>Fee per Student</p>
            </div>
          </div>
          <div className="finance-stat-card">
            <FaChartLine />
            <div>
              <h3>{stats?.approvedRegistrations || 0}</h3>
              <p>Approved This Month</p>
            </div>
          </div>
        </div>

        {/* Department Revenue */}
        <div className="revenue-section card">
          <h2><FaChartLine /> Revenue by Department</h2>
          <div className="revenue-grid">
            {stats?.departmentStats?.map((dept) => (
              <div key={dept._id} className="revenue-card">
                <div className="revenue-header">
                  <h4>{dept._id}</h4>
                  <span>{dept.count} students</span>
                </div>
                <div className="revenue-amount">
                  {formatCurrency(dept.earnings)}
                </div>
                <div className="revenue-bar">
                  <div 
                    className="bar-fill"
                    style={{ width: `${(dept.earnings / (stats?.totalEarnings || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="revenue-percent">
                  {((dept.earnings / (stats?.totalEarnings || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section card">
          <h2>Recent Transactions</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.slice(0, 10).map((reg) => (
                  <tr key={reg._id}>
                    <td>{new Date(reg.approvedAt || reg.createdAt).toLocaleDateString()}</td>
                    <td>{reg.student?.fullName}</td>
                    <td><span className="dept-tag">{reg.department}</span></td>
                    <td className="amount">{formatCurrency(30000)}</td>
                    <td><span className="paid-badge">Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialReports;