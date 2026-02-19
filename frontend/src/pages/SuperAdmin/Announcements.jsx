// src/pages/SuperAdmin/Announcements.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaBell, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimes,
  FaUsers,
  FaUserGraduate,
  FaUserShield,
  FaBuilding,
  FaCalendarAlt,
  FaExclamationCircle,
  FaInfoCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaBullhorn
} from 'react-icons/fa';
import './Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
    department: '',
    expiresAt: ''
  });

  const types = [
    { value: 'general', label: 'General', icon: FaInfoCircle, color: '#3b82f6' },
    { value: 'urgent', label: 'Urgent', icon: FaExclamationCircle, color: '#ef4444' },
    { value: 'event', label: 'Event', icon: FaCalendarAlt, color: '#8b5cf6' },
    { value: 'reminder', label: 'Reminder', icon: FaClock, color: '#f59e0b' }
  ];

  const audiences = [
    { value: 'all', label: 'All Users', icon: FaUsers },
    { value: 'students', label: 'Students Only', icon: FaUserGraduate },
    { value: 'admins', label: 'Admins Only', icon: FaUserShield },
    { value: 'department', label: 'Specific Department', icon: FaBuilding }
  ];

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Demo data
      setAnnouncements([
        {
          _id: '1',
          title: 'Welcome to KNAX250 Internship Program!',
          content: 'We are excited to welcome all new interns to our program. Please make sure to complete your registration and submit all required documents.',
          type: 'general',
          targetAudience: 'all',
          createdAt: new Date('2024-02-01'),
          isActive: true
        },
        {
          _id: '2',
          title: 'Urgent: Schedule Change for SOD Department',
          content: 'Due to maintenance work, all SOD classes will be held in Lab 2 instead of Lab 1 for the next two weeks starting Monday.',
          type: 'urgent',
          targetAudience: 'department',
          department: 'SOD',
          createdAt: new Date('2024-02-10'),
          isActive: true
        },
        {
          _id: '3',
          title: 'Tech Career Fair - February 25th',
          content: 'Join us for our annual Tech Career Fair! Meet industry professionals, explore job opportunities, and network with potential employers. All students are encouraged to attend.',
          type: 'event',
          targetAudience: 'students',
          createdAt: new Date('2024-02-05'),
          expiresAt: new Date('2024-02-26'),
          isActive: true
        },
        {
          _id: '4',
          title: 'Reminder: Submit Weekly Reports',
          content: 'This is a reminder to all interns to submit their weekly progress reports by Friday 5:00 PM. Late submissions will not be accepted.',
          type: 'reminder',
          targetAudience: 'students',
          createdAt: new Date('2024-02-12'),
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, formData);
        toast.success('Announcement updated successfully!');
      } else {
        await api.post('/announcements', formData);
        toast.success('Announcement posted successfully!');
      }
      setShowModal(false);
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      type: announcement.type || 'general',
      targetAudience: announcement.targetAudience || 'all',
      department: announcement.department || '',
      expiresAt: announcement.expiresAt 
        ? new Date(announcement.expiresAt).toISOString().split('T')[0] 
        : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        toast.success('Announcement deleted successfully');
        fetchAnnouncements();
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      targetAudience: 'all',
      department: '',
      expiresAt: ''
    });
    setEditingAnnouncement(null);
  };

  const getTypeConfig = (type) => {
    return types.find(t => t.value === type) || types[0];
  };

  const getAudienceLabel = (audience, department) => {
    if (audience === 'department' && department) {
      return `${department} Department`;
    }
    return audiences.find(a => a.value === audience)?.label || audience;
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = 
      ann.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ann.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="announcements-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1><FaBell /> Announcements</h1>
            <p>Create and manage announcements for users</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> New Announcement
          </button>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          <div className="filter-item">
            <label><FaFilter /> Type:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="announcement-stats">
          {types.map(type => {
            const count = announcements.filter(a => a.type === type.value).length;
            const TypeIcon = type.icon;
            return (
              <div 
                key={type.value} 
                className={`stat-chip ${type.value}`}
                onClick={() => setFilterType(type.value)}
              >
                <TypeIcon />
                <span>{type.label}</span>
                <span className="count">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Announcements Grid */}
        <div className="announcements-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => {
              const typeConfig = getTypeConfig(announcement.type);
              const TypeIcon = typeConfig.icon;
              return (
                <div 
                  key={announcement._id} 
                  className={`announcement-card ${announcement.type}`}
                >
                  <div className="announcement-type-badge" style={{ background: typeConfig.color }}>
                    <TypeIcon />
                    <span>{typeConfig.label}</span>
                  </div>
                  
                  <div className="announcement-header">
                    <h3>{announcement.title}</h3>
                    <div className="announcement-actions">
                      <button 
                        className="btn-icon edit"
                        onClick={() => handleEdit(announcement)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => handleDelete(announcement._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <p className="announcement-content">{announcement.content}</p>
                  
                  <div className="announcement-footer">
                    <div className="announcement-meta">
                      <span className="audience-badge">
                        <FaUsers />
                        {getAudienceLabel(announcement.targetAudience, announcement.department)}
                      </span>
                      <span className="date">
                        <FaCalendarAlt />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {announcement.expiresAt && (
                      <span className="expires">
                        <FaClock />
                        Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <FaBullhorn />
              <h3>No Announcements Found</h3>
              <p>Create your first announcement to get started</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus /> Create Announcement
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your announcement content..."
                    rows="5"
                    required
                  />
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {types.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    >
                      {audiences.map(aud => (
                        <option key={aud.value} value={aud.value}>{aud.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.targetAudience === 'department' && (
                  <div className="form-group">
                    <label>Select Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    >
                      <option value="">Choose department...</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Expires On (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => { setShowModal(false); resetForm(); }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Post Announcement')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Announcements;