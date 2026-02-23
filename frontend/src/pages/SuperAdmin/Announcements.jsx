// src/pages/SuperAdmin/Announcements.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaGlobe,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaSync
} from 'react-icons/fa';
import './Announcements.css';

const Announcements = () => {
  const { user } = useAuth();
  
  // IMPORTANT: Initialize as empty array
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    department: '',
    targetAudience: 'all',
    expiresAt: ''
  });

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];
  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'normal', label: 'Normal', color: '#3b82f6' },
    { value: 'high', label: 'High', color: '#f59e0b' },
    { value: 'urgent', label: 'Urgent', color: '#ef4444' }
  ];

  // Safe array helper function
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.announcements && Array.isArray(data.announcements)) return data.announcements;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      console.log('Announcements response:', response.data);
      
      // Safely extract array
      const data = ensureArray(response.data);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
      setAnnouncements([]); // Reset to empty array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      department: '',
      targetAudience: 'all',
      expiresAt: ''
    });
    setSelectedAnnouncement(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      priority: announcement.priority || 'normal',
      department: announcement.department || '',
      targetAudience: announcement.targetAudience || 'all',
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedAnnouncement) {
        await api.put(`/announcements/${selectedAnnouncement._id}`, formData);
        toast.success('Announcement updated');
      } else {
        await api.post('/announcements', formData);
        toast.success('Announcement created');
      }
      
      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/announcements/${selectedAnnouncement._id}`);
      toast.success('Announcement deleted');
      setShowDeleteModal(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // SAFE FILTERING
  const safeAnnouncements = ensureArray(announcements);
  const filteredAnnouncements = safeAnnouncements.filter(ann => {
    const matchesSearch = 
      ann.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || ann.priority === priorityFilter;
    const matchesDepartment = !departmentFilter || ann.department === departmentFilter || ann.targetAudience === 'all';
    
    return matchesSearch && matchesPriority && matchesDepartment;
  });

  const getPriorityColor = (priority) => {
    const found = priorities.find(p => p.value === priority);
    return found ? found.color : '#3b82f6';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <FaExclamationTriangle />;
      case 'high': return <FaExclamationTriangle />;
      case 'normal': return <FaInfoCircle />;
      case 'low': return <FaCheckCircle />;
      default: return <FaInfoCircle />;
    }
  };

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="announcements-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1><FaBullhorn /> Announcements</h1>
            <p>Create and manage announcements for students and staff</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={fetchAnnouncements}>
              <FaSync /> Refresh
            </button>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <FaPlus /> New Announcement
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>{safeAnnouncements.length}</h3>
            <p>Total Announcements</p>
          </div>
          <div className="stat-card">
            <h3>{safeAnnouncements.filter(a => a.priority === 'urgent').length}</h3>
            <p>Urgent</p>
          </div>
          <div className="stat-card">
            <h3>{safeAnnouncements.filter(a => a.priority === 'high').length}</h3>
            <p>High Priority</p>
          </div>
          <div className="stat-card">
            <h3>{safeAnnouncements.filter(a => a.targetAudience === 'all').length}</h3>
            <p>Global</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
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
        </div>

        {/* Announcements Grid */}
        <div className="announcements-grid">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map(announcement => (
              <div 
                key={announcement._id} 
                className="announcement-card"
                style={{ borderLeftColor: getPriorityColor(announcement.priority) }}
              >
                <div className="announcement-header">
                  <span 
                    className="priority-badge"
                    style={{ background: getPriorityColor(announcement.priority) }}
                  >
                    {getPriorityIcon(announcement.priority)}
                    {announcement.priority}
                  </span>
                  <div className="announcement-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => openEditModal(announcement)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(announcement)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <h3>{announcement.title}</h3>
                <p className="announcement-content">{announcement.content}</p>
                
                <div className="announcement-meta">
                  <span>
                    <FaCalendar /> {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {announcement.targetAudience === 'all' ? (
                      <><FaGlobe /> All</>
                    ) : (
                      <><FaBuilding /> {announcement.department}</>
                    )}
                  </span>
                  {announcement.createdBy && (
                    <span>
                      <FaUser /> {announcement.createdBy?.fullName || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaBullhorn />
              <h3>No Announcements Found</h3>
              <p>Click "New Announcement" to create one</p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => !submitting && setShowModal(false)}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)} disabled={submitting}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Announcement title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Announcement content..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      {priorities.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                    >
                      <option value="all">All (Global)</option>
                      <option value="department">Specific Department</option>
                      <option value="students">Students Only</option>
                      <option value="admins">Admins Only</option>
                    </select>
                  </div>
                </div>

                {formData.targetAudience === 'department' && (
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Expires At (Optional)</label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : (selectedAnnouncement ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
              <div className="modal-header danger">
                <h2>Delete Announcement</h2>
                <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Are you sure you want to delete "<strong>{selectedAnnouncement?.title}</strong>"?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Announcements;