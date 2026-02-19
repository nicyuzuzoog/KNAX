// pages/SuperAdmin/FinancialReports.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { FaMoneyBillWave, FaChartLine, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import './FinancialReports.css';

const FinancialReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFinancialStats();
  }, [dateRange]);

  const fetchFinancialStats = async () => {
    try {
      const response = await api.get('/admin/financial-stats', { params: dateRange });
      setStats(response.data);
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

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="financial-reports-page">
        <div className="page-header">
          <div>
            <h1><FaMoneyBillWave /> Financial Reports</h1>
            <p>View earnings and revenue statistics</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <FaDownload /> Export Report
          </button>
        </div>

        <div className="date-filters card">
          <div className="date-filter-group">
            <label><FaCalendarAlt /> Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="date-filter-group">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="revenue-cards">
          <div className="revenue-card total">
            <FaMoneyBillWave className="revenue-icon" />
            <div>
              <h3>{formatCurrency(stats?.totalRevenue || 0)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="revenue-card pending">
            <FaChartLine className="revenue-icon" />
            <div>
              <h3>{formatCurrency(stats?.pendingRevenue || 0)}</h3>
              <p>Pending Payments</p>
            </div>
          </div>
        </div>

        <div className="dept-revenue-table card">
          <h2>Revenue by Department</h2>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Students</th>
                <th>Revenue</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats?.departmentRevenue?.map(dept => (
                <tr key={dept._id}>
                  <td><span className={`dept-badge ${dept._id.toLowerCase()}`}>{dept._id}</span></td>
                  <td>{dept.count}</td>
                  <td>{formatCurrency(dept.revenue)}</td>
                  <td>{((dept.revenue / stats.totalRevenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialReports;