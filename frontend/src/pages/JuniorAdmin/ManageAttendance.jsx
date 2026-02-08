import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import { 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaExclamationCircle,
  FaUserGraduate,
  FaSave,
  FaCalendarAlt
} from 'react-icons/fa';
import './ManageAttendance.css';

const ManageAttendance = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [existingAttendance, setExistingAttendance] = useState([]);

  useEffect(() => {
    fetchInterns();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchExistingAttendance();
    }
  }, [selectedDate]);

  const fetchInterns = async () => {
    try {
      const response = await api.get('/attendance/active-interns');
      setInterns(response.data);
      
      const initialData = {};
      response.data.forEach(intern => {
        initialData[intern._id] = {
          status: 'present',
          checkInTime: '08:00',
          checkOutTime: '17:00',
          notes: ''
        };
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await api.get(`/attendance/by-date?date=${selectedDate}`);
      setExistingAttendance(response.data);
      
      const updatedData = { ...attendanceData };
      response.data.forEach(record => {
        if (record.registration?._id) {
          updatedData[record.registration._id] = {
            status: record.status,
            checkInTime: record.checkInTime || '',
            checkOutTime: record.checkOutTime || '',
            notes: record.notes || ''
          };
        }
      });
      setAttendanceData(updatedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAttendanceChange = (internId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [internId]: { ...prev[internId], [field]: value }
    }));
  };

  const handleSave = async (internId) => {
    setSaving(true);
    try {
      const data = attendanceData[internId];
      await api.post('/attendance', {
        registrationId: internId,
        status: data.status,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        notes: data.notes
      });
      toast.success('Attendance saved!');
      fetchExistingAttendance();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isMarked = (internId) => {
    return existingAttendance.some(r => r.registration?._id === internId);
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
      <div className="attendance-page">
        <div className="page-header">
          <div>
            <h1><FaCalendarCheck /> Manage Attendance</h1>
            <p>Mark daily attendance for active interns</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="date-selector-card">
          <FaCalendarAlt />
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Summary */}
        <div className="attendance-summary">
          <div className="summary-card present">
            <FaCheckCircle />
            <span>{existingAttendance.filter(a => a.status === 'present').length}</span>
            <label>Present</label>
          </div>
          <div className="summary-card late">
            <FaClock />
            <span>{existingAttendance.filter(a => a.status === 'late').length}</span>
            <label>Late</label>
          </div>
          <div className="summary-card absent">
            <FaTimesCircle />
            <span>{existingAttendance.filter(a => a.status === 'absent').length}</span>
            <label>Absent</label>
          </div>
        </div>

        {/* Interns List */}
        <div className="interns-list">
          {interns.length > 0 ? (
            interns.map((intern) => (
              <div key={intern._id} className={`intern-card ${isMarked(intern._id) ? 'marked' : ''}`}>
                <div className="intern-header">
                  <div className="intern-avatar">
                    <FaUserGraduate />
                  </div>
                  <div className="intern-info">
                    <h3>{intern.student?.fullName}</h3>
                    <p>{intern.school?.name} • {intern.class?.name}</p>
                  </div>
                  {isMarked(intern._id) && (
                    <span className="marked-badge"><FaCheckCircle /> Marked</span>
                  )}
                </div>

                <div className="attendance-form">
                  <div className="status-buttons">
                    {['present', 'late', 'absent', 'excused'].map((status) => (
                      <button
                        key={status}
                        className={`status-btn ${status} ${attendanceData[intern._id]?.status === status ? 'active' : ''}`}
                        onClick={() => handleAttendanceChange(intern._id, 'status', status)}
                      >
                        {status === 'present' && <FaCheckCircle />}
                        {status === 'late' && <FaClock />}
                        {status === 'absent' && <FaTimesCircle />}
                        {status === 'excused' && <FaExclamationCircle />}
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>

                  <div className="time-row">
                    <div className="time-input">
                      <label>Check In</label>
                      <input
                        type="time"
                        value={attendanceData[intern._id]?.checkInTime || ''}
                        onChange={(e) => handleAttendanceChange(intern._id, 'checkInTime', e.target.value)}
                      />
                    </div>
                    <div className="time-input">
                      <label>Check Out</label>
                      <input
                        type="time"
                        value={attendanceData[intern._id]?.checkOutTime || ''}
                        onChange={(e) => handleAttendanceChange(intern._id, 'checkOutTime', e.target.value)}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={attendanceData[intern._id]?.notes || ''}
                    onChange={(e) => handleAttendanceChange(intern._id, 'notes', e.target.value)}
                    className="notes-input"
                  />

                  <button 
                    className="btn btn-primary save-btn"
                    onClick={() => handleSave(intern._id)}
                    disabled={saving}
                  >
                    <FaSave /> {isMarked(intern._id) ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-interns">
              <FaUserGraduate />
              <h3>No Active Interns</h3>
              <p>No approved interns in your department yet.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageAttendance;