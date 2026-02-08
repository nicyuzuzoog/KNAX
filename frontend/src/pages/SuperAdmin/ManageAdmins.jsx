import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import { 
  FaUserShield, 
  FaPlus, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCog,
  FaCheck
} from 'react-icons/fa';
import './ManageAdmins.css';

const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    permissions: {
      canApprovePayments: true,
      canRejectPayments: true,
      canViewRegistrations: true,
      canManageAttendance: true,
      canViewFinancials: false
    }
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/junior-admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/junior-admins', formData);
      toast.success('Junior admin created successfully!');
      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        permissions: {
          canApprovePayments: true,
          canRejectPayments: true,
          canViewRegistrations: true,
          canManageAttendance: true,
          canViewFinancials: false
        }
      });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/junior-admins/${id}/toggle`);
      toast.success('Admin status updated');
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await api.delete(`/admin/junior-admins/${id}`);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  const openPermissionsModal = (admin) => {
    setSelectedAdmin(admin);
    setShowPermissionsModal(true);
  };

  const handlePermissionChange = async (permission, value) => {
    if (!selectedAdmin) return;
    
    try {
      const newPermissions = {
        ...selectedAdmin.permissions,
        [permission]: value
      };
      
      await api.patch(`/admin/junior-admins/${selectedAdmin._id}/permissions`, {
        permissions: newPermissions
      });
      
      toast.success('Permission updated');
      setSelectedAdmin({ ...selectedAdmin, permissions: newPermissions });
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update permission');
    }
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
      <div className="manage-admins-page">
        <div className="page-header">
          <div>
            <h1><FaUserShield /> Manage Junior Admins</h1>
            <p>Create and manage junior administrators with custom permissions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Junior Admin
          </button>
        </div>

        {/* Admins Grid */}
        <div className="admins-grid">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <div key={admin._id} className={`admin-card ${!admin.isActive ? 'inactive' : ''}`}>
                <div className="admin-card-header">
                  <div className="admin-avatar">
                    <FaUserShield />
                  </div>
                  <div className="admin-info">
                    <h3>{admin.fullName}</h3>
                    <span className="dept-badge">{admin.department}</span>
                  </div>
                  <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="admin-details">
                  <p><FaEnvelope /> {admin.email}</p>
                  <p><FaPhone /> {admin.phone || 'N/A'}</p>
                </div>

                <div className="admin-permissions">
                  <h4>Permissions</h4>
                  <div className="permissions-list">
                    <div className={`permission-item ${admin.permissions?.canApprovePayments ? 'enabled' : 'disabled'}`}>
                      {admin.permissions?.canApprovePayments ? <FaCheck /> : <FaTimes />}
                      <span>Approve Payments</span>
                    </div>
                    <div className={`permission-item ${admin.permissions?.canRejectPayments ? 'enabled' : 'disabled'}`}>
                      {admin.permissions?.canRejectPayments ? <FaCheck /> : <FaTimes />}
                      <span>Reject Payments</span>
                    </div>
                    <div className={`permission-item ${admin.permissions?.canManageAttendance ? 'enabled' : 'disabled'}`}>
                      {admin.permissions?.canManageAttendance ? <FaCheck /> : <FaTimes />}
                      <span>Manage Attendance</span>
                    </div>
                  </div>
                </div>

                <div className="admin-actions">
                  <button 
                    className="btn-action settings"
                    onClick={() => openPermissionsModal(admin)}
                    title="Manage Permissions"
                  >
                    <FaCog />
                  </button>
                  <button 
                    className={`btn-action toggle ${admin.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleStatus(admin._id)}
                    title={admin.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {admin.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDelete(admin._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-admins">
              <FaUserShield />
              <h3>No Junior Admins</h3>
              <p>Create your first junior admin to manage departments</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus /> Add Junior Admin
              </button>
            </div>
          )}
        </div>

        {/* Add Admin Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2><FaPlus /> Add Junior Admin</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><FaUserShield /> Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label><FaBuilding /> Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    minLength="6"
                    required
                  />
                </div>

                {/* Initial Permissions */}
                <div className="form-group">
                  <label>Initial Permissions</label>
                  <div className="permissions-checkboxes">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canApprovePayments}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, canApprovePayments: e.target.checked }
                        })}
                      />
                      <span>Can Approve Payments</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canRejectPayments}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, canRejectPayments: e.target.checked }
                        })}
                      />
                      <span>Can Reject Payments</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canViewRegistrations}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, canViewRegistrations: e.target.checked }
                        })}
                      />
                      <span>Can View Registrations</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canManageAttendance}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, canManageAttendance: e.target.checked }
                        })}
                      />
                      <span>Can Manage Attendance</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedAdmin && (
          <div className="modal-overlay">
            <div className="modal permissions-modal">
              <div className="modal-header">
                <h2><FaCog /> Manage Permissions</h2>
                <button className="close-btn" onClick={() => setShowPermissionsModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="permission-admin-info">
                  <FaUserShield />
                  <div>
                    <h3>{selectedAdmin.fullName}</h3>
                    <span>{selectedAdmin.department}</span>
                  </div>
                </div>

                <div className="permission-toggles">
                  <div className="permission-toggle">
                    <div className="permission-info">
                      <h4>Approve Payments</h4>
                      <p>Allow this admin to approve student payments</p>
                    </div>
                    <button
                      className={`toggle-btn ${selectedAdmin.permissions?.canApprovePayments ? 'on' : 'off'}`}
                      onClick={() => handlePermissionChange('canApprovePayments', !selectedAdmin.permissions?.canApprovePayments)}
                    >
                      {selectedAdmin.permissions?.canApprovePayments ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>

                  <div className="permission-toggle">
                    <div className="permission-info">
                      <h4>Reject Payments</h4>
                      <p>Allow this admin to reject student payments</p>
                    </div>
                    <button
                      className={`toggle-btn ${selectedAdmin.permissions?.canRejectPayments ? 'on' : 'off'}`}
                      onClick={() => handlePermissionChange('canRejectPayments', !selectedAdmin.permissions?.canRejectPayments)}
                    >
                      {selectedAdmin.permissions?.canRejectPayments ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>

                  <div className="permission-toggle">
                    <div className="permission-info">
                      <h4>View Registrations</h4>
                      <p>Allow this admin to view all registrations</p>
                    </div>
                    <button
                      className={`toggle-btn ${selectedAdmin.permissions?.canViewRegistrations ? 'on' : 'off'}`}
                      onClick={() => handlePermissionChange('canViewRegistrations', !selectedAdmin.permissions?.canViewRegistrations)}
                    >
                      {selectedAdmin.permissions?.canViewRegistrations ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>

                  <div className="permission-toggle">
                    <div className="permission-info">
                      <h4>Manage Attendance</h4>
                      <p>Allow this admin to mark student attendance</p>
                    </div>
                    <button
                      className={`toggle-btn ${selectedAdmin.permissions?.canManageAttendance ? 'on' : 'off'}`}
                      onClick={() => handlePermissionChange('canManageAttendance', !selectedAdmin.permissions?.canManageAttendance)}
                    >
                      {selectedAdmin.permissions?.canManageAttendance ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>

                  <div className="permission-toggle">
                    <div className="permission-info">
                      <h4>View Financials</h4>
                      <p>Allow this admin to view financial reports</p>
                    </div>
                    <button
                      className={`toggle-btn ${selectedAdmin.permissions?.canViewFinancials ? 'on' : 'off'}`}
                      onClick={() => handlePermissionChange('canViewFinancials', !selectedAdmin.permissions?.canViewFinancials)}
                    >
                      {selectedAdmin.permissions?.canViewFinancials ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageAdmins;