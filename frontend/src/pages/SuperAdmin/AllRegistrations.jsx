// pages/SuperAdmin/AllRegistrations.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import './AllRegistrations.css';

const AllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    shift: ''
  });
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [filters]);

  const fetchRegistrations = async () => {
    try {
      let url = '/registrations';
      const params = [];
      
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.department) params.push(`department=${filters.department}`);
      if (filters.shift) params.push(`shift=${filters.shift}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await api.get(url);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
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

  const downloadCSV = () => {
    const headers = ['Student Name', 'Email', 'Phone', 'Department', 'School', 'Class', 'Shift', 'Parent Phone', 'Status', 'Date'];
    const rows = filteredRegistrations.map(reg => [
      reg.student?.fullName,
      reg.student?.email,
      reg.student?.phone,
      reg.department,
      reg.school?.name,
      reg.class?.name,
      reg.shift,
      reg.parentPhone,
      reg.paymentStatus,
      new Date(reg.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('CSV downloaded successfully');
  };

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = search.toLowerCase();
    return (
      reg.student?.fullName?.toLowerCase().includes(searchLower) ||
      reg.student?.email?.toLowerCase().includes(searchLower) ||
      reg.parentPhone?.includes(search) ||
      reg.school?.name?.toLowerCase().includes(searchLower)
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
      <div className="all-registrations-page">
        <div className="page-header">
          <div>
            <h1><FaClipboardList /> All Registrations</h1>
            <p>View and manage all student applications across all departments</p>
          </div>
          <button className="btn btn-primary" onClick={downloadCSV}>
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="summary-card">
            <span className="summary-number">{registrations.length}</span>
            <span className="summary-label">Total Registrations</span>
          </div>
          <div className="summary-card approved">
            <span className="summary-number">
              {registrations.filter(r => r.paymentStatus === 'approved').length}
            </span>
            <span className="summary-label">Approved</span>
          </div>
          <div className="summary-card pending">
            <span className="summary-number">
              {registrations.filter(r => r.paymentStatus === 'pending').length}
            </span>
            <span className="summary-label">Pending</span>
          </div>
          <div className="summary-card rejected">
            <span className="summary-number">
              {registrations.filter(r => r.paymentStatus === 'rejected').length}
            </span>
            <span className="summary-label">Rejected</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card card">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, email, phone, or school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label><FaFilter /> Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Department:</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                <option value="NIT">NIT</option>
                <option value="SOD">SOD</option>
                <option value="ACCOUNTING">ACCOUNTING</option>
                <option value="CSA">CSA</option>
                <option value="ETE">ETE</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Shift:</label>
              <select
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
              >
                <option value="">All Shifts</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
            </div>

            {(filters.status || filters.department || filters.shift) && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setFilters({ status: '', department: '', shift: '' })}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="registrations-table card">
          <div className="table-container">
            {filteredRegistrations.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Department</th>
                    <th>School / Class</th>
                    <th>Shift</th>
                    <th>Parent Phone</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <div className="student-info">
                          <strong>{reg.student?.fullName}</strong>
                          <small>{reg.student?.email}</small>
                          <small className="phone">{reg.student?.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`dept-badge ${reg.department.toLowerCase()}`}>
                          {reg.department}
                        </span>
                      </td>
                      <td>
                        <div className="school-info">
                          <span>{reg.school?.name}</span>
                          <small>{reg.class?.name}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`shift-badge ${reg.shift}`}>
                          {reg.shift === 'morning' ? <FaSun /> : <FaMoon />}
                          {reg.shift}
                        </span>
                      </td>
                      <td>
                        <span className="parent-phone">
                          <FaPhone /> {reg.parentPhone}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus === 'approved' && <FaCheckCircle />}
                          {reg.paymentStatus === 'rejected' && <FaTimesCircle />}
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-icon view"
                          onClick={() => viewDetails(reg._id)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <FaClipboardList />
                <h3>No Registrations Found</h3>
                <p>{search || filters.status || filters.department ? 'Try adjusting your filters' : 'No registrations yet'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedReg && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Registration Details</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-section">
                    <h3>Student Information</h3>
                    <div className="detail-item">
                      <label>Full Name:</label>
                      <span>{selectedReg.student?.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedReg.student?.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedReg.student?.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Age:</label>
                      <span>{selectedReg.student?.age} years</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Internship Details</h3>
                    <div className="detail-item">
                      <label>Department:</label>
                      <span className={`dept-badge ${selectedReg.department.toLowerCase()}`}>
                        {selectedReg.department}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>School:</label>
                      <span>{selectedReg.school?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Class:</label>
                      <span>{selectedReg.class?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Shift:</label>
                      <span className={`shift-badge ${selectedReg.shift}`}>
                        {selectedReg.shift === 'morning' ? <FaSun /> : <FaMoon />}
                        {selectedReg.shift}
                      </span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Contact & Payment</h3>
                    <div className="detail-item">
                      <label>Parent/Guardian Phone:</label>
                      <span><FaPhone /> {selectedReg.parentPhone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Amount Paid:</label>
                      <span>{selectedReg.amountPaid?.toLocaleString()} RWF</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge ${selectedReg.paymentStatus}`}>
                        {selectedReg.paymentStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Applied On:</label>
                      <span>{new Date(selectedReg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedReg.receiptPhoto && (
                  <div className="receipt-section">
                    <h3>Payment Receipt</h3>
                    <img 
                      src={`http://localhost:5000/${selectedReg.receiptPhoto}`}
                      alt="Payment Receipt"
                      className="receipt-image"
                    />
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