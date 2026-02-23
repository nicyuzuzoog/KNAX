// src/pages/SuperAdmin/FinancialReports.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaChartLine,
  FaMoneyBillWave,
  FaCalendar,
  FaDownload,
  FaFilter,
  FaBuilding,
  FaUsers,
  FaCheckCircle,
  FaHourglassHalf,
  FaSync,
  FaFileExcel,
  FaFilePdf
} from 'react-icons/fa';
import './FinancialReports.css';

const FinancialReports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    totalRegistrations: 0,
    approvedRegistrations: 0,
    pendingRegistrations: 0,
    rejectedRegistrations: 0,
    departmentStats: [],
    monthlyRevenue: []
  });
  const [registrations, setRegistrations] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

  // Safe array helper
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.registrations && Array.isArray(data.registrations)) return data.registrations;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.transactions && Array.isArray(data.transactions)) return data.transactions;
    return [];
  };

  const fetchFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch registrations data
      const response = await api.get('/registrations');
      const allRegistrations = ensureArray(response.data);
      
      // Filter by date range
      const filteredRegistrations = allRegistrations.filter(reg => {
        const regDate = new Date(reg.createdAt);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);
        return regDate >= start && regDate <= end;
      });

      setRegistrations(filteredRegistrations);

      // Calculate stats
      const approved = filteredRegistrations.filter(r => r.paymentStatus === 'approved');
      const pending = filteredRegistrations.filter(r => r.paymentStatus === 'pending');
      const rejected = filteredRegistrations.filter(r => r.paymentStatus === 'rejected');

      const totalRevenue = approved.reduce((sum, r) => sum + (r.amountPaid || 30000), 0);
      const pendingAmount = pending.length * 30000;

      // Calculate department stats
      const deptStats = departments.map(dept => {
        const deptRegs = approved.filter(r => r.department === dept);
        return {
          department: dept,
          count: deptRegs.length,
          revenue: deptRegs.reduce((sum, r) => sum + (r.amountPaid || 30000), 0)
        };
      });

      // Calculate monthly revenue
      const monthlyData = {};
      approved.forEach(reg => {
        const month = new Date(reg.approvedAt || reg.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, revenue: 0, count: 0 };
        }
        monthlyData[month].revenue += reg.amountPaid || 30000;
        monthlyData[month].count += 1;
      });

      setStats({
        totalRevenue,
        pendingAmount,
        totalRegistrations: filteredRegistrations.length,
        approvedRegistrations: approved.length,
        pendingRegistrations: pending.length,
        rejectedRegistrations: rejected.length,
        departmentStats: deptStats,
        monthlyRevenue: Object.values(monthlyData)
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to load financial data');
      // Set default values on error
      setRegistrations([]);
      setStats({
        totalRevenue: 0,
        pendingAmount: 0,
        totalRegistrations: 0,
        approvedRegistrations: 0,
        pendingRegistrations: 0,
        rejectedRegistrations: 0,
        departmentStats: [],
        monthlyRevenue: []
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Student', 'Department', 'Amount', 'Status', 'Approved By'];
    const approvedRegs = ensureArray(registrations).filter(r => r.paymentStatus === 'approved');
    
    const csvData = approvedRegs.map(reg => [
      new Date(reg.approvedAt || reg.createdAt).toLocaleDateString(),
      reg.student?.fullName || 'N/A',
      reg.department || 'N/A',
      reg.amountPaid || 30000,
      reg.paymentStatus,
      reg.approvedBy?.fullName || 'N/A'
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    toast.success('Report exported successfully');
  };

  // Filter registrations by department
  const filteredRegistrations = departmentFilter 
    ? ensureArray(registrations).filter(r => r.department === departmentFilter)
    : ensureArray(registrations);

  const approvedTransactions = filteredRegistrations.filter(r => r.paymentStatus === 'approved');

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="financial-reports-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1><FaChartLine /> Financial Reports</h1>
            <p>Track revenue, payments, and financial statistics</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={fetchFinancialData}>
              <FaSync /> Refresh
            </button>
            <button className="btn btn-primary" onClick={exportToCSV}>
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="date-filter-section">
          <div className="date-inputs">
            <div className="date-input">
              <label><FaCalendar /> From</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="date-input">
              <label><FaCalendar /> To</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="filter-box">
            <FaBuilding />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon"><FaMoneyBillWave /></div>
            <div className="stat-content">
              <h3>{stats.totalRevenue.toLocaleString()} RWF</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon"><FaHourglassHalf /></div>
            <div className="stat-content">
              <h3>{stats.pendingAmount.toLocaleString()} RWF</h3>
              <p>Pending Amount</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon"><FaCheckCircle /></div>
            <div className="stat-content">
              <h3>{stats.approvedRegistrations}</h3>
              <p>Approved Payments</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon"><FaUsers /></div>
            <div className="stat-content">
              <h3>{stats.totalRegistrations}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className="report-section">
          <h2><FaBuilding /> Revenue by Department</h2>
          <div className="department-stats">
            {ensureArray(stats.departmentStats).map(dept => (
              <div key={dept.department} className="dept-stat-card">
                <div className="dept-header">
                  <span className="dept-name">{dept.department}</span>
                  <span className="dept-count">{dept.count} students</span>
                </div>
                <div className="dept-revenue">
                  {dept.revenue.toLocaleString()} RWF
                </div>
                <div className="dept-bar">
                  <div 
                    className="dept-bar-fill"
                    style={{ 
                      width: `${stats.totalRevenue > 0 ? (dept.revenue / stats.totalRevenue) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="report-section">
          <h2><FaMoneyBillWave /> Recent Transactions</h2>
          <div className="table-container">
            {approvedTransactions.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Department</th>
                    <th>Amount</th>
                    <th>Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTransactions.slice(0, 20).map((reg) => (
                    <tr key={reg._id}>
                      <td>{new Date(reg.approvedAt || reg.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="student-cell">
                          <div className="avatar">
                            {reg.student?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <span>{reg.student?.fullName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td><span className="dept-badge">{reg.department}</span></td>
                      <td><strong className="amount">{(reg.amountPaid || 30000).toLocaleString()} RWF</strong></td>
                      <td>{reg.approvedBy?.fullName || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <FaMoneyBillWave />
                <h3>No Transactions Found</h3>
                <p>No approved payments in the selected date range</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Summary */}
        {ensureArray(stats.monthlyRevenue).length > 0 && (
          <div className="report-section">
            <h2><FaCalendar /> Monthly Summary</h2>
            <div className="monthly-stats">
              {ensureArray(stats.monthlyRevenue).map((month, index) => (
                <div key={index} className="month-card">
                  <div className="month-name">{month.month}</div>
                  <div className="month-revenue">{month.revenue.toLocaleString()} RWF</div>
                  <div className="month-count">{month.count} payments</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FinancialReports;