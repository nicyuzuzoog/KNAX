// src/pages/SuperAdmin/AllRegistrations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaHourglassHalf,
  FaTimes,
  FaMoneyBillWave,
  FaReceipt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaBuilding,
  FaDownload,
  FaExclamationTriangle,
  FaGraduationCap,
  FaSync,
  FaFileExport
} from 'react-icons/fa';
import './AllRegistrations.css';

const AllRegistrations = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // IMPORTANT: Initialize as empty array
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

  // Safe array helper function
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.registrations && Array.isArray(data.registrations)) return data.registrations;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/registrations');
      console.log('API Response:', response.data);
      
      // Safely extract array from response
      const data = ensureArray(response.data);
      console.log('Processed registrations:', data.length);
      
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
      setRegistrations([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    const regId = searchParams.get('id');
    if (regId && registrations.length > 0) {
      const reg = registrations.find(r => r._id === regId);
      if (reg) {
        openModal(reg);
      }
    }
    
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams, registrations]);

  const openModal = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
    setSearchParams({});
  };

  const openReceiptModal = (url) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    setReceiptUrl(url?.startsWith('http') ? url : `${baseUrl}${url}`);
    setShowReceiptModal(true);
  };

  const handleApprove = async (registration) => {
    const confirmed = window.confirm(
      `Approve payment of ${(registration.amountPaid || 30000).toLocaleString()} RWF for ${registration.student?.fullName}?`
    );
    
    if (!confirmed) return;

    setProcessing(true);
    try {
      await api.patch(`/registrations/${registration._id}/approve`);
      toast.success(`Payment approved for ${registration.student?.fullName}!`);
      fetchRegistrations();
      closeModal();
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve payment');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (registration) => {
    setSelectedRegistration(registration);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await api.patch(`/registrations/${selectedRegistration._id}/reject`, {
        reason: rejectReason
      });
      toast.success('Payment rejected');
      fetchRegistrations();
      setShowRejectModal(false);
      closeModal();
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  // SAFE FILTERING - Always ensure registrations is an array
  const filteredRegistrations = ensureArray(registrations).filter(reg => {
    const matchesSearch = 
      reg.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student?.phone?.includes(searchTerm);
    
    const matchesStatus = !statusFilter || reg.paymentStatus === statusFilter;
    const matchesDepartment = !departmentFilter || reg.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // SAFE STATS CALCULATION
  const safeRegistrations = ensureArray(registrations);
  const stats = {
    total: safeRegistrations.length,
    pending: safeRegistrations.filter(r => r.paymentStatus === 'pending').length,
    approved: safeRegistrations.filter(r => r.paymentStatus === 'approved').length,
    rejected: safeRegistrations.filter(r => r.paymentStatus === 'rejected').length
  };

  const totalRevenue = safeRegistrations
    .filter(r => r.paymentStatus === 'approved')
    .reduce((sum, r) => sum + (r.amountPaid || 30000), 0);

  const exportToCSV = () => {
    const headers = ['Student Name', 'Email', 'Phone', 'School', 'Department', 'Shift', 'Amount', 'Status', 'Date'];
    const csvData = filteredRegistrations.map(reg => [
      reg.student?.fullName || 'N/A',
      reg.student?.email || 'N/A',
      reg.student?.phone || 'N/A',
      reg.school?.name || 'N/A',
      reg.department || 'N/A',
      reg.shift || 'N/A',
      reg.amountPaid || 30000,
      reg.paymentStatus || 'N/A',
      new Date(reg.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="all-registrations-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1><FaClipboardList /> All Registrations</h1>
            <p>Manage all student registrations across departments</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={fetchRegistrations}>
              <FaSync /> Refresh
            </button>
            <button className="btn btn-primary" onClick={exportToCSV}>
              <FaFileExport /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div 
            className={`stat-card ${!statusFilter ? 'active' : ''}`} 
            onClick={() => setStatusFilter('')}
          >
            <div className="stat-icon total"><FaClipboardList /></div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total</p>
            </div>
          </div>
          <div 
            className={`stat-card ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            <div className="stat-icon pending"><FaHourglassHalf /></div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
            {stats.pending > 0 && <span className="stat-badge">{stats.pending}</span>}
          </div>
          <div 
            className={`stat-card ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            <div className="stat-icon approved"><FaCheckCircle /></div>
            <div className="stat-info">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div 
            className={`stat-card ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            <div className="stat-icon rejected"><FaTimesCircle /></div>
            <div className="stat-info">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon"><FaMoneyBillWave /></div>
            <div className="stat-info">
              <h3>{totalRevenue.toLocaleString()} RWF</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          <div className="filter-box">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
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
          {(statusFilter || searchTerm || departmentFilter) && (
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => {
                setStatusFilter('');
                setSearchTerm('');
                setDepartmentFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Registrations Table */}
        <div className="table-container">
          {filteredRegistrations.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>School</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr 
                    key={reg._id} 
                    className={reg.paymentStatus === 'pending' ? 'highlight-row' : ''}
                  >
                    <td>
                      <div className="student-cell">
                        <div className="avatar">
                          {reg.student?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div className="student-name">
                          <span>{reg.student?.fullName || 'Unknown'}</span>
                          <small>Age: {reg.student?.age || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span><FaEnvelope /> {reg.student?.email || 'N/A'}</span>
                        <span><FaPhone /> {reg.student?.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{reg.school?.name || 'N/A'}</td>
                    <td>
                      <span className="dept-badge">{reg.department || 'N/A'}</span>
                    </td>
                    <td>{reg.shift || 'N/A'}</td>
                    <td>
                      <strong className="amount">{(reg.amountPaid || 30000).toLocaleString()} RWF</strong>
                    </td>
                    <td>
                      {reg.receiptPhoto ? (
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => openReceiptModal(reg.receiptPhoto)}
                        >
                          <FaReceipt /> View
                        </button>
                      ) : (
                        <span className="no-receipt">No receipt</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${reg.paymentStatus}`}>
                        {reg.paymentStatus === 'pending' && <FaHourglassHalf />}
                        {reg.paymentStatus === 'approved' && <FaCheckCircle />}
                        {reg.paymentStatus === 'rejected' && <FaTimesCircle />}
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => openModal(reg)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {reg.paymentStatus === 'pending' && (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleApprove(reg)}
                              disabled={processing}
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => openRejectModal(reg)}
                              disabled={processing}
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FaClipboardList />
              <h3>No Registrations Found</h3>
              <p>
                {statusFilter || departmentFilter
                  ? 'No registrations match your filters.'
                  : searchTerm 
                    ? 'No registrations match your search.'
                    : 'No registrations yet.'}
              </p>
              {(statusFilter || searchTerm || departmentFilter) && (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setStatusFilter('');
                    setSearchTerm('');
                    setDepartmentFilter('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {showModal && selectedRegistration && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><FaUser /> Registration Details</h2>
                <button className="close-btn" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <h3><FaUser /> Student Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Full Name</label>
                      <span>{selectedRegistration.student?.fullName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <span>{selectedRegistration.student?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <span>{selectedRegistration.student?.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Age</label>
                      <span>{selectedRegistration.student?.age || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><FaGraduationCap /> Registration Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>School</label>
                      <span>{selectedRegistration.school?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Department</label>
                      <span className="dept-badge">{selectedRegistration.department || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Shift</label>
                      <span>{selectedRegistration.shift || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Start Date</label>
                      <span>
                        {selectedRegistration.startDate 
                          ? new Date(selectedRegistration.startDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><FaMoneyBillWave /> Payment Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Amount</label>
                      <span className="amount-large">
                        {(selectedRegistration.amountPaid || 30000).toLocaleString()} RWF
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span className={`status-badge large ${selectedRegistration.paymentStatus}`}>
                        {selectedRegistration.paymentStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date</label>
                      <span>{new Date(selectedRegistration.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedRegistration.approvedBy && (
                      <div className="detail-item">
                        <label>Approved By</label>
                        <span>{selectedRegistration.approvedBy?.fullName || 'N/A'}</span>
                      </div>
                    )}
                    {selectedRegistration.rejectionReason && (
                      <div className="detail-item full-width">
                        <label>Rejection Reason</label>
                        <span className="rejection-reason">
                          <FaExclamationTriangle /> {selectedRegistration.rejectionReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRegistration.receiptPhoto && (
                  <div className="detail-section">
                    <h3><FaReceipt /> Payment Receipt</h3>
                    <div className="receipt-preview">
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${selectedRegistration.receiptPhoto}`}
                        alt="Payment Receipt"
                        onClick={() => openReceiptModal(selectedRegistration.receiptPhoto)}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  </div>
                )}
              </div>

              {selectedRegistration.paymentStatus === 'pending' && (
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={closeModal}>Close</button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => openRejectModal(selectedRegistration)}
                    disabled={processing}
                  >
                    <FaTimesCircle /> Reject
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApprove(selectedRegistration)}
                    disabled={processing}
                  >
                    <FaCheckCircle /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
            <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
              <div className="modal-header danger">
                <h2><FaExclamationTriangle /> Reject Payment</h2>
                <button className="close-btn" onClick={() => setShowRejectModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Rejecting payment for <strong>{selectedRegistration?.student?.fullName}</strong></p>
                
                <div className="form-group">
                  <label>Reason for Rejection *</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={processing || !rejectReason.trim()}
                >
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && (
          <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
            <div className="modal modal-receipt" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><FaReceipt /> Payment Receipt</h2>
                <button className="close-btn" onClick={() => setShowReceiptModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <img src={receiptUrl} alt="Receipt" className="receipt-full" />
              </div>
              <div className="modal-footer">
                <a href={receiptUrl} download className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllRegistrations;