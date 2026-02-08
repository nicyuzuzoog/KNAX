import React, { useState, useEffect } from 'react';
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
  FaTimes,
  FaImage
} from 'react-icons/fa';
import './AllRegistrations.css';

const AllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', department: '' });
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.department) params.append('department', filter.department);
      
      const response = await api.get(`/registrations?${params}`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
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
      reg.student?.email?.toLowerCase().includes(searchLower) ||
      reg.department?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#FFF3E0', color: '#F57C00' },
      approved: { bg: '#E8F5E9', color: '#388E3C' },
      rejected: { bg: '#FFEBEE', color: '#D32F2F' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span 
        className="status-badge" 
        style={{ background: style.bg, color: style.color }}
      >
        {status}
      </span>
    );
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
      <div className="registrations-page">
        <div className="page-header">
          <div>
            <h1><FaClipboardList /> All Registrations</h1>
            <p>View and manage all internship registrations</p>
          </div>
        </div>

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
          <div className="filter-selects">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filter.department}
              onChange={(e) => setFilter({ ...filter, department: e.target.value })}
            >
              <option value="">All Departments</option>
              <option value="NIT">NIT</option>
              <option value="SOD">SOD</option>
              <option value="ACCOUNTING">ACCOUNTING</option>
              <option value="CSA">CSA</option>
              <option value="ETE">ETE</option>
            </select>
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
                  <th>Department</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td><strong>{reg.student?.fullName}</strong></td>
                      <td>{reg.student?.email}</td>
                      <td><span className="dept-tag">{reg.department}</span></td>
                      <td>{reg.school?.name}</td>
                      <td>{reg.class?.name}</td>
                      <td>{getStatusBadge(reg.paymentStatus)}</td>
                      <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
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
                              <button 
                                className="btn-icon approve"
                                onClick={() => handleStatusUpdate(reg._id, 'approved')}
                              >
                                <FaCheckCircle />
                              </button>
                              <button 
                                className="btn-icon reject"
                                onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
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
                <div className="detail-section">
                  <h3>Student Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Full Name</label>
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
                      <label>Age</label>
                      <span>{selectedReg.student?.age || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Internship Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Department</label>
                      <span>{selectedReg.department}</span>
                    </div>
                    <div className="detail-item">
                      <label>School</label>
                      <span>{selectedReg.school?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Class</label>
                      <span>{selectedReg.class?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Amount</label>
                      <span>30,000 RWF</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><FaImage /> Payment Receipt</h3>
                  {selectedReg.receiptPhoto ? (
                    <img 
                      src={`http://localhost:5000/${selectedReg.receiptPhoto}`}
                      alt="Receipt"
                      className="receipt-img"
                    />
                  ) : (
                    <p>No receipt uploaded</p>
                  )}
                </div>

                {selectedReg.paymentStatus === 'pending' && (
                  <div className="modal-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate(selectedReg._id, 'approved')}
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate(selectedReg._id, 'rejected')}
                    >
                      <FaTimesCircle /> Reject
                    </button>
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

export default AllRegistrations;