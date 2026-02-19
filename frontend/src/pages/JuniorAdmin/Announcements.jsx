// src/pages/JuniorAdmin/Announcements.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaBell,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaBullhorn,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUsers,
  FaCheck
} from 'react-icons/fa';
import '../SuperAdmin/Announcements.css';

const JuniorAdminAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'department',
    department: user?.department || '',
    expiresAt: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      const filtered = response.data.filter(a => 
        a.department === user?.department || a.createdBy?._id === user?.id
      );
      setAnnouncements(filtered);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        department: user?.department,
        targetAudience: 'department'
      };

      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, data);
        toast.success('Announcement updated!');
      } else {
        await api.post('/announcements', data);
        toast.success('Announcement created!');
      }
      
      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      targetAudience: 'department',
      department: user?.department,
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement deleted!');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
      targetAudience: 'department',
      department: user?.department || '',
      expiresAt: ''
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return <FaExclamationTriangle style={{ color: '#f44336' }} />;
      case 'event': return <FaCalendarAlt style={{ color: '#2196F3' }} />;
      case 'reminder': return <FaBell style={{ color: '#FF9800' }} />;
      default: return <FaBullhorn style={{ color: '#4CAF50' }} />;
    }
  };

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="announcements-page">
        <div className="page-header">
          <div>
            <h1><FaBell /> Announcements</h1>
            <p>Create announcements for {user?.department} department</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> New Announcement
          </button>
        </div>

        {/* Announcements List */}
        <div className="announcements-grid">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div 
                key={announcement._id} 
                className={`announcement-card ${announcement.type}`}
              >
                <div className="announcement-header">
                  <div className="announcement-type">
                    {getTypeIcon(announcement.type)}
                    <span className={`type-badge ${announcement.type}`}>
                      {announcement.type}
                    </span>
                  </div>
                  <div className="announcement-actions">
                    <button onClick={() => handleEdit(announcement)}><FaEdit /></button>
                    <button onClick={() => handleDelete(announcement._id)}><FaTrash /></button>
                  </div>
                </div>

                <h3>{announcement.title}</h3>
                <p className="announcement-content">{announcement.content}</p>

                <div className="announcement-meta">
                  <span className="target">
                    <FaUsers /> {user?.department}
                  </span>
                  <span className="date">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="announcement-footer">
                  <span className="read-count">
                    <FaCheck /> {announcement.readBy?.length || 0} read
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-announcements">
              <FaBell />
              <h3>No Announcements</h3>
              <p>Create your first announcement</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your announcement..."
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Expires On (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
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

export default JuniorAdminAnnouncements;