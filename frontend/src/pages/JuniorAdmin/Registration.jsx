// src/pages/JuniorAdmin/Registrations.jsx
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
  FaSync
} from 'react-icons/fa';
import './Registrations.css';

const JuniorAdminRegistrations = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // IMPORTANT: Initialize as empty array
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/registrations');
      console.log('API Response:', response.data);
      
      // Handle different response formats
      let data = [];
      
      if (Array.isArray(response.data)) {
        // Response is directly an array
        data = response.data;
      } else if (response.data && Array.isArray(response.data.registrations)) {
        // Response is { registrations: [...] }
        data = response.data.registrations;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Response is { data: [...] }
        data = response.data.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        data = [];
      }
      
      // Filter by department if junior admin has one
      if (user?.role === 'junior_admin' && user?.department) {
        data = data.filter(r => r.department === user.department);
      }
      
      console.log('Processed registrations:', data.length);
      setRegistrations(data);
      
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
      setRegistrations([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    // Check if we need to open a specific registration
    const regId = searchParams.get('id');
    if (regId && registrations.length > 0) {
      const reg = registrations.find(r => r._id === regId);
      if (reg) {
        openModal(reg);
      }
    }
    
    // Update status filter from URL
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
    if (!user?.permissions?.canApprovePayments && user?.role !== 'super_admin') {
      toast.error('You do not have permission to approve payments');
      return;
    }

    const confirmed = window.confirm(
      `Approve payment of ${(registration.amountPaid || 30000).toLocaleString()} RWF for ${registration.student?.fullName}?`
    );
    
    if (!confirmed) return;

    setProcessing(true);
    try {
      // Try /approve first, fall back to /status
      let response;
      try {
        response = await api.patch(`/registrations/${registration._id}/approve`);
      } catch (err) {
        if (err.response?.status === 404) {
          response = await api.patch(`/registrations/${registration._id}/status`, {
            status: 'approved'
          });
        } else {
          throw err;
        }
      }
      
      console.log('Approve response:', response.data);
      toast.success(`Payment approved for ${registration.student?.fullName}!`);
      fetchRegistrations();
      closeModal();
    } catch (error) {
      console.error('Approval error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to approve payment');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (registration) => {
    if (!user?.permissions?.canRejectPayments && user?.role !== 'super_admin') {
      toast.error('You do not have permission to reject payments');
      return;
    }
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
      // Try /reject first, fall back to /status
      let response;
      try {
        response = await api.patch(`/registrations/${selectedRegistration._id}/reject`, {
          reason: rejectReason
        });
      } catch (err) {
        if (err.response?.status === 404) {
          response = await api.patch(`/registrations/${selectedRegistration._id}/status`, {
            status: 'rejected',
            reason: rejectReason
          });
        } else {
          throw err;
        }
      }
      
      console.log('Reject response:', response.data);
      toast.success('Payment rejected');
      fetchRegistrations();
      setShowRejectModal(false);
      closeModal();
    } catch (error) {
      console.error('Rejection error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  // SAFE FILTERING - Always check if registrations is an array
  const filteredRegistrations = Array.isArray(registrations) 
    ? registrations.filter(reg => {
        const matchesSearch = 
          reg.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.student?.phone?.includes(searchTerm);
        
        const matchesStatus = !statusFilter || reg.paymentStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
    : [];

  // SAFE STATS CALCULATION
  const stats = {
    total: Array.isArray(registrations) ? registrations.length : 0,
    pending: Array.isArray(registrations) ? registrations.filter(r => r.paymentStatus === 'pending').length : 0,
    approved: Array.isArray(registrations) ? registrations.filter(r => r.paymentStatus === 'approved').length : 0,
    rejected: Array.isArray(registrations) ? registrations.filter(r => r.paymentStatus === 'rejected').length : 0
  };

  const totalRevenue = Array.isArray(registrations)
    ? registrations
        .filter(r => r.paymentStatus === 'approved')
        .reduce((sum, r) => sum + (r.amountPaid || 30000), 0)
    : 0;

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="registrations-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1><FaClipboardList /> Student Registrations</h1>
            <p>Manage student registrations and payment approvals</p>
            {user?.department && (
              <span className="department-badge">
                <FaBuilding /> {user.department} Department
              </span>
            )}
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={fetchRegistrations}>
              <FaSync /> Refresh
            </button>
            {(user?.permissions?.canApprovePayments || user?.permissions?.canViewFinancials) && (
              <div className="revenue-stat">
                <FaMoneyBillWave />
                <div>
                  <span className="revenue-amount">{totalRevenue.toLocaleString()} RWF</span>
                  <span className="revenue-label">Total Revenue</span>
                </div>
              </div>
            )}
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
          {(statusFilter || searchTerm) && (
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => {
                setStatusFilter('');
                setSearchTerm('');
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
                    <td>
                      <div className="school-cell">
                        <FaSchool /> {reg.school?.name || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="dept-badge">{reg.department || 'N/A'}</span>
                    </td>
                    <td>
                      <strong className="amount">{(reg.amountPaid || 30000).toLocaleString()} RWF</strong>
                    </td>
                    <td>
                      {reg.receiptPhoto ? (
                        <button 
                          className="btn btn-sm btn-outline receipt-btn"
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
                    <td>
                      <span className="date-cell">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                    </td>
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
                            {(user?.permissions?.canApprovePayments || user?.role === 'super_admin') && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(reg)}
                                disabled={processing}
                                title="Approve Payment"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            {(user?.permissions?.canRejectPayments || user?.role === 'super_admin') && (
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => openRejectModal(reg)}
                                disabled={processing}
                                title="Reject Payment"
                              >
                                <FaTimesCircle />
                              </button>
                            )}
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
                {statusFilter 
                  ? `No ${statusFilter} registrations found.`
                  : searchTerm 
                    ? 'No registrations match your search.'
                    : 'No registrations in your department yet.'}
              </p>
              {(statusFilter || searchTerm) && (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setStatusFilter('');
                    setSearchTerm('');
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
                {/* Student Info */}
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

                {/* Registration Info */}
                <div className="detail-section">
                  <h3><FaGraduationCap /> Registration Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>School</label>
                      <span>{selectedRegistration.school?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Class/Level</label>
                      <span>{selectedRegistration.class?.name || selectedRegistration.level || 'N/A'}</span>
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
                    <div className="detail-item">
                      <label>End Date</label>
                      <span>
                        {selectedRegistration.endDate 
                          ? new Date(selectedRegistration.endDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
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
                        {selectedRegistration.paymentStatus === 'pending' && <FaHourglassHalf />}
                        {selectedRegistration.paymentStatus === 'approved' && <FaCheckCircle />}
                        {selectedRegistration.paymentStatus === 'rejected' && <FaTimesCircle />}
                        {selectedRegistration.paymentStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date</label>
                      <span>{new Date(selectedRegistration.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedRegistration.approvedAt && (
                      <div className="detail-item">
                        <label>Approved Date</label>
                        <span>{new Date(selectedRegistration.approvedAt).toLocaleString()}</span>
                      </div>
                    )}
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

                {/* Receipt Photo */}
                {selectedRegistration.receiptPhoto && (
                  <div className="detail-section">
                    <h3><FaReceipt /> Payment Receipt</h3>
                    <div className="receipt-preview">
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${selectedRegistration.receiptPhoto}`}
                        alt="Payment Receipt"
                        onClick={() => openReceiptModal(selectedRegistration.receiptPhoto)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="receipt-actions">
                        <button 
                          className="btn btn-outline"
                          onClick={() => openReceiptModal(selectedRegistration.receiptPhoto)}
                        >
                          <FaEye /> View Full Size
                        </button>
                        <a 
                          href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${selectedRegistration.receiptPhoto}`}
                          download
                          className="btn btn-outline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaDownload /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              {selectedRegistration.paymentStatus === 'pending' && (
                <div className="modal-footer">
                  <button 
                    className="btn btn-outline"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  {(user?.permissions?.canRejectPayments || user?.role === 'super_admin') && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => openRejectModal(selectedRegistration)}
                      disabled={processing}
                    >
                      <FaTimesCircle /> Reject Payment
                    </button>
                  )}
                  {(user?.permissions?.canApprovePayments || user?.role === 'super_admin') && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedRegistration)}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : (
                        <>
                          <FaCheckCircle /> Approve Payment
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRegistration && (
          <div className="modal-overlay" onClick={() => !processing && setShowRejectModal(false)}>
            <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
              <div className="modal-header danger">
                <h2><FaExclamationTriangle /> Reject Payment</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowRejectModal(false)}
                  disabled={processing}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="reject-info">
                  <p>You are about to reject the payment for:</p>
                  <div className="student-preview">
                    <div className="avatar">
                      {selectedRegistration?.student?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <strong>{selectedRegistration?.student?.fullName}</strong>
                      <span>{(selectedRegistration?.amountPaid || 30000).toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Reason for Rejection *</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    rows={4}
                    required
                  />
                  <small>The student will be notified of this rejection.</small>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowRejectModal(false)}
                  disabled={processing}
                >
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
              <div className="modal-body receipt-body">
                <img 
                  src={receiptUrl} 
                  alt="Receipt" 
                  className="receipt-full"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                    e.target.alt = 'Failed to load receipt';
                  }}
                />
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close
                </button>
                <a 
                  href={receiptUrl} 
                  download 
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

export default JuniorAdminRegistrations;