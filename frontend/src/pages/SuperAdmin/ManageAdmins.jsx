// src/pages/SuperAdmin/ManageAdmins.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import './ManageAdmins.css';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    department: '',
    permissions: {
      canViewRegistrations: true,
      canApprovePayments: true,
      canRejectPayments: true,
      canManageAttendance: true,
      canManageTimetable: true,
      canManageShifts: true,
      canPostAnnouncements: true,
      canViewFinancials: false,
      canUploadReceipts: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/junior-admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      department: '',
      permissions: {
        canViewRegistrations: true,
        canApprovePayments: true,
        canRejectPayments: true,
        canManageAttendance: true,
        canManageTimetable: true,
        canManageShifts: true,
        canPostAnnouncements: true,
        canViewFinancials: false,
        canUploadReceipts: true
      }
    });
    setEditingAdmin(null);
    setShowPassword(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName || '',
      email: admin.email || '',
      password: '',
      phone: admin.phone || '',
      age: admin.age || '',
      department: admin.department || '',
      permissions: admin.permissions || {
        canViewRegistrations: true,
        canApprovePayments: true,
        canRejectPayments: true,
        canManageAttendance: true,
        canManageTimetable: true,
        canManageShifts: true,
        canPostAnnouncements: true,
        canViewFinancials: false,
        canUploadReceipts: true
      }
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('perm_')) {
      const permName = name.replace('perm_', '');
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone is required');
      return;
    }
    if (!formData.department) {
      toast.error('Department is required');
      return;
    }
    if (!editingAdmin && !formData.password) {
      toast.error('Password is required');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : 25
      };

      // Remove password if editing and not changing it
      if (editingAdmin && !formData.password) {
        delete submitData.password;
      }

      if (editingAdmin) {
        await api.put(`/admin/junior-admins/${editingAdmin._id}`, submitData);
        toast.success('Admin updated successfully');
      } else {
        await api.post('/admin/junior-admins', submitData);
        toast.success('Admin created successfully! They can now login with their credentials.');
      }

      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      await api.patch(`/admin/junior-admins/${admin._id}/toggle`);
      toast.success(`Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/admin/junior-admins/${selectedAdmin._id}/reset-password`, {
        newPassword: passwordData.newPassword
      });
      toast.success('Password reset successfully');
      setShowPasswordModal(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/admin/junior-admins/${selectedAdmin._id}`);
      toast.success('Admin deleted successfully');
      setShowDeleteModal(false);
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || admin.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="manage-admins-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1><FaUserShield /> Manage Junior Admins</h1>
            <p>Create and manage department administrators</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <FaPlus /> Add Junior Admin
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats-row">
          <div className="stat-box">
            <h3>{admins.length}</h3>
            <p>Total Admins</p>
          </div>
          <div className="stat-box active">
            <h3>{admins.filter(a => a.isActive).length}</h3>
            <p>Active</p>
          </div>
          <div className="stat-box inactive">
            <h3>{admins.filter(a => !a.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Admins Grid */}
        <div className="admins-grid">
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <div key={admin._id} className={`admin-card card ${!admin.isActive ? 'inactive' : ''}`}>
                <div className="admin-avatar">
                  <span>{admin.fullName?.charAt(0)?.toUpperCase() || 'A'}</span>
                </div>
                <h3>{admin.fullName}</h3>
                <p className="admin-email"><FaEnvelope /> {admin.email}</p>
                <p className="admin-phone"><FaPhone /> {admin.phone}</p>
                <span className={`dept-badge ${admin.department?.toLowerCase()}`}>
                  <FaBuilding /> {admin.department || 'No Department'}
                </span>
                <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
                
                <div className="permissions-preview">
                  {admin.permissions?.canViewRegistrations && <span title="View Registrations">📋</span>}
                  {admin.permissions?.canApprovePayments && <span title="Approve Payments">✅</span>}
                  {admin.permissions?.canManageAttendance && <span title="Manage Attendance">📅</span>}
                  {admin.permissions?.canManageTimetable && <span title="Manage Timetable">🕐</span>}
                  {admin.permissions?.canPostAnnouncements && <span title="Post Announcements">📢</span>}
                </div>

                <div className="admin-actions">
                  <button 
                    className="btn btn-sm btn-outline" 
                    onClick={() => openEditModal(admin)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline" 
                    onClick={() => openPasswordModal(admin)}
                    title="Reset Password"
                  >
                    <FaKey />
                  </button>
                  <button 
                    className={`btn btn-sm ${admin.isActive ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleToggleStatus(admin)}
                    title={admin.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {admin.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => openDeleteModal(admin)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaUserShield />
              <h3>No Junior Admins Found</h3>
              <p>Click "Add Junior Admin" to create one</p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAdmin ? 'Edit Junior Admin' : 'Create Junior Admin'}</h2>
                <button 
                  className="close-btn" 
                  onClick={() => !submitting && setShowModal(false)}
                  disabled={submitting}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      min="18"
                      max="100"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={editingAdmin ? 'Enter new password' : 'Enter password'}
                        minLength={6}
                        required={!editingAdmin}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Permissions</label>
                  <div className="permissions-grid">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canViewRegistrations"
                        checked={formData.permissions.canViewRegistrations}
                        onChange={handleChange}
                      />
                      <span>View Registrations</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canApprovePayments"
                        checked={formData.permissions.canApprovePayments}
                        onChange={handleChange}
                      />
                      <span>Approve Payments</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canRejectPayments"
                        checked={formData.permissions.canRejectPayments}
                        onChange={handleChange}
                      />
                      <span>Reject Payments</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canManageAttendance"
                        checked={formData.permissions.canManageAttendance}
                        onChange={handleChange}
                      />
                      <span>Manage Attendance</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canManageTimetable"
                        checked={formData.permissions.canManageTimetable}
                        onChange={handleChange}
                      />
                      <span>Manage Timetable</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canManageShifts"
                        checked={formData.permissions.canManageShifts}
                        onChange={handleChange}
                      />
                      <span>Manage Shifts</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canPostAnnouncements"
                        checked={formData.permissions.canPostAnnouncements}
                        onChange={handleChange}
                      />
                      <span>Post Announcements</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="perm_canViewFinancials"
                        checked={formData.permissions.canViewFinancials}
                        onChange={handleChange}
                      />
                      <span>View Financials</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      'Saving...'
                    ) : (
                      <>
                        <FaCheck /> {editingAdmin ? 'Update' : 'Create'} Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => !submitting && setShowPasswordModal(false)}>
            <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Reset Password</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowPasswordModal(false)}
                  disabled={submitting}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleResetPassword} className="modal-body">
                <p className="modal-description">
                  Reset password for <strong>{selectedAdmin?.fullName}</strong>
                </p>
                
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ 
                        ...prev, 
                        newPassword: e.target.value 
                      }))}
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ 
                      ...prev, 
                      confirmPassword: e.target.value 
                    }))}
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowPasswordModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => !submitting && setShowDeleteModal(false)}>
            <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header danger">
                <h2>Delete Admin</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={submitting}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{selectedAdmin?.fullName}</strong>?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  {submitting ? 'Deleting...' : 'Delete Admin'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageAdmins;