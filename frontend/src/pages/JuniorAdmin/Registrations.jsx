import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import { 
  FaClipboardList, 
  FaSearch, 
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaTimes,
  FaLock
} from 'react-icons/fa';
import './Registrations.css';

const AdminRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Check permissions
  const canApprove = user?.permissions?.canApprovePayments !== false;
  const canReject = user?.permissions?.canRejectPayments !== false;

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await api.get(`/registrations${params}`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    // Check permission
    if (status === 'approved' && !canApprove) {
      toast.error('You do not have permission to approve payments');
      return;
    }
    if (status === 'rejected' && !canReject) {
      toast.error('You do not have permission to reject payments');
      return;
    }

    try {
      await api.patch(`/registrations/${id}/status`, { 
        status,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      });
      toast.success(`Registration ${status}!`);
      fetchRegistrations();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const viewDetails = async (id) => {
    try {
      const response = await api.get(`/registrations/${id}`);
      setSelectedReg(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load details');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = search.toLowerCase();
    return (
      reg.student?.fullName?.toLowerCase().includes(searchLower) ||
      reg.student?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="registrations-page">
        <div className="page-header">
          <div>
            <h1><FaClipboardList /> Registrations</h1>
            <p>Manage registrations for {user?.department} department</p>
          </div>
        </div>

        {/* Permission Notice */}
        {(!canApprove || !canReject) && (
          <div className="permission-notice">
            <FaLock />
            <span>
              Limited permissions: 
              {!canApprove && ' Cannot approve payments.'}
              {!canReject && ' Cannot reject payments.'}
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="filters-card">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button 
              className={`tab ${filter === '' ? 'active' : ''}`}
              onClick={() => setFilter('')}
            >
              All
            </button>
            <button 
              className={`tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td><strong>{reg.student?.fullName}</strong></td>
                      <td>{reg.student?.email}</td>
                      <td>{reg.student?.phone || '-'}</td>
                      <td>{reg.school?.name}</td>
                      <td>{reg.class?.name}</td>
                      <td>
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button 
                            className="btn-icon view"
                            onClick={() => viewDetails(reg._id)}
                          >
                            <FaEye />
                          </button>
                          {reg.paymentStatus === 'pending' && (
                            <>
                              {canApprove && (
                                <button 
                                  className="btn-icon approve"
                                  onClick={() => handleStatusUpdate(reg._id, 'approved')}
                                >
                                  <FaCheckCircle />
                                </button>
                              )}
                              {canReject && (
                                <button 
                                  className="btn-icon reject"
                                  onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                                >
                                  <FaTimesCircle />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedReg && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>Registration Details</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Student</label>
                    <span>{selectedReg.student?.fullName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedReg.student?.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <span>{selectedReg.student?.phone || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>School</label>
                    <span>{selectedReg.school?.name}</span>
                  </div>
                </div>

                {selectedReg.receiptPhoto && (
                  <div className="receipt-section">
                    <h3>Payment Receipt</h3>
                    <img 
                      src={`http://localhost:5000/${selectedReg.receiptPhoto}`}
                      alt="Receipt"
                    />
                  </div>
                )}

                {selectedReg.paymentStatus === 'pending' && (canApprove || canReject) && (
                  <div className="modal-actions">
                    {canApprove && (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleStatusUpdate(selectedReg._id, 'approved')}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                    )}
                    {canReject && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleStatusUpdate(selectedReg._id, 'rejected')}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRegistrations;