// src/pages/JuniorAdmin/ManageShifts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaUsers
} from 'react-icons/fa';
import './ManageShifts.css';

const ManageShifts = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({
    name: 'morning',
    department: user?.department || '',
    startTime: '08:00',
    endTime: '12:00',
    maxCapacity: 30
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await api.get('/shifts');
      setShifts(response.data);
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

      if (editingShift) {
        await api.put(`/shifts/${editingShift._id}`, data);
        toast.success('Shift updated!');
      } else {
        await api.post('/shifts', data);
        toast.success('Shift created!');
      }
      
      setShowModal(false);
      resetForm();
      fetchShifts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save shift');
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      department: shift.department,
      startTime: shift.startTime,
      endTime: shift.endTime,
      maxCapacity: shift.maxCapacity
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shift?')) return;
    
    try {
      await api.delete(`/shifts/${id}`);
      toast.success('Shift deleted!');
      fetchShifts();
    } catch (error) {
      toast.error('Failed to delete shift');
    }
  };

  const resetForm = () => {
    setEditingShift(null);
    setFormData({
      name: 'morning',
      department: user?.department || '',
      startTime: '08:00',
      endTime: '12:00',
      maxCapacity: 30
    });
  };

  const getShiftIcon = (name) => {
    switch (name) {
      case 'morning': return <FaSun style={{ color: '#FF9800' }} />;
      case 'afternoon': return <FaCloudSun style={{ color: '#2196F3' }} />;
      case 'evening': return <FaMoon style={{ color: '#673AB7' }} />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return <AdminLayout><Loader /></AdminLayout>;
  }

  // Group shifts by department
  const shiftsByDept = shifts.reduce((acc, shift) => {
    if (!acc[shift.department]) acc[shift.department] = [];
    acc[shift.department].push(shift);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="shifts-page">
        <div className="page-header">
          <div>
            <h1><FaClock /> Manage Shifts</h1>
            <p>Create and manage morning, afternoon, and evening shifts</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add Shift
          </button>
        </div>

        {/* Shifts Grid */}
        <div className="shifts-container">
          {Object.entries(shiftsByDept).map(([dept, deptShifts]) => (
            <div key={dept} className="dept-shifts-section">
              <h2 className="dept-title">{dept} Department</h2>
              <div className="shifts-grid">
                {deptShifts.map((shift) => (
                  <div key={shift._id} className={`shift-card ${shift.name}`}>
                    <div className="shift-header">
                      {getShiftIcon(shift.name)}
                      <h3>{shift.name.charAt(0).toUpperCase() + shift.name.slice(1)} Shift</h3>
                    </div>
                    <div className="shift-times">
                      <span className="time">{shift.startTime}</span>
                      <span className="separator">-</span>
                      <span className="time">{shift.endTime}</span>
                    </div>
                    <div className="shift-capacity">
                      <FaUsers />
                      <span>{shift.currentEnrollment || 0} / {shift.maxCapacity}</span>
                    </div>
                    <div className="shift-actions">
                      <button onClick={() => handleEdit(shift)}><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete(shift._id)}><FaTrash /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {shifts.length === 0 && (
            <div className="no-shifts">
              <FaClock />
              <h3>No Shifts Created</h3>
              <p>Create your first shift to get started</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingShift ? 'Edit Shift' : 'Create Shift'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Shift Type</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                {user?.role === 'super_admin' && (
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="NIT">NIT</option>
                      <option value="SOD">SOD</option>
                      <option value="ACCOUNTING">ACCOUNTING</option>
                      <option value="CSA">CSA</option>
                      <option value="ETE">ETE</option>
                    </select>
                  </div>
                )}

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
                  <label>Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingShift ? 'Update' : 'Create'} Shift
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

export default ManageShifts;