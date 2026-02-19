// src/pages/JuniorAdmin/ManageTimetable.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaClock
} from 'react-icons/fa';
import './ManageTimetable.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shifts = ['morning', 'afternoon'];

const ManageTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    department: user?.department || '',
    dayOfWeek: 1,
    shift: 'morning',
    startTime: '08:00',
    endTime: '10:00',
    subject: '',
    instructor: '',
    room: '',
    description: ''
  });

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const fetchTimetable = async () => {
    try {
      const dept = user?.role === 'junior_admin' ? user.department : formData.department;
      const response = await api.get(`/timetable?department=${dept}&day=${selectedDay}`);
      setTimetable(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        department: user?.role === 'junior_admin' ? user.department : formData.department
      };

      if (editingEntry) {
        await api.patch(`/timetable/${editingEntry._id}`, data);
        toast.success('Timetable entry updated!');
      } else {
        await api.post('/timetable', data);
        toast.success('Timetable entry added!');
      }
      
      setShowModal(false);
      resetForm();
      fetchTimetable();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save entry');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      department: entry.department,
      dayOfWeek: entry.dayOfWeek,
      shift: entry.shift,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      instructor: entry.instructor || '',
      room: entry.room || '',
      description: entry.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable entry?')) return;
    
    try {
      await api.delete(`/timetable/${id}`);
      toast.success('Entry deleted!');
      fetchTimetable();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setEditingEntry(null);
    setFormData({
      department: user?.department || '',
      dayOfWeek: selectedDay,
      shift: 'morning',
      startTime: '08:00',
      endTime: '10:00',
      subject: '',
      instructor: '',
      room: '',
      description: ''
    });
  };

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="timetable-page">
        <div className="page-header">
          <div>
            <h1><FaCalendarAlt /> Manage Timetable</h1>
            <p>Create weekly timetable for {user?.department} department</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add Entry
          </button>
        </div>

        {/* Day Tabs */}
        <div className="day-tabs">
          {days.map((day, index) => (
            <button
              key={index}
              className={`day-tab ${selectedDay === index + 1 ? 'active' : ''}`}
              onClick={() => setSelectedDay(index + 1)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Grid */}
        <div className="timetable-grid">
          {shifts.map((shift) => (
            <div key={shift} className="shift-column">
              <h3 className={`shift-header ${shift}`}>
                {shift === 'morning' ? '🌅 Morning Shift' : '🌆 Afternoon Shift'}
              </h3>
              <div className="entries-list">
                {timetable
                  .filter(entry => entry.shift === shift)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((entry) => (
                    <div key={entry._id} className="timetable-entry">
                      <div className="entry-time">
                        <FaClock />
                        <span>{entry.startTime} - {entry.endTime}</span>
                      </div>
                      <div className="entry-details">
                        <h4>{entry.subject}</h4>
                        {entry.instructor && <p className="instructor">👨‍🏫 {entry.instructor}</p>}
                        {entry.room && <p className="room">📍 {entry.room}</p>}
                      </div>
                      <div className="entry-actions">
                        <button onClick={() => handleEdit(entry)}><FaEdit /></button>
                        <button onClick={() => handleDelete(entry._id)}><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                {timetable.filter(e => e.shift === shift).length === 0 && (
                  <p className="no-entries">No entries for this shift</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingEntry ? 'Edit Entry' : 'Add Timetable Entry'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Day</label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    >
                      {days.map((day, index) => (
                        <option key={index} value={index + 1}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Shift</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Instructor</label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="Instructor name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Room</label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="e.g., Lab 1"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingEntry ? 'Update' : 'Add'} Entry
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

export default ManageTimetable;