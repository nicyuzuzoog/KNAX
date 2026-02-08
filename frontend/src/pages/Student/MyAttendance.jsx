import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaExclamationCircle,
  FaFilter
} from 'react-icons/fa';
import './MyAttendance.css';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/my-attendance');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FaCheckCircle className="status-icon present" />;
      case 'absent':
        return <FaTimesCircle className="status-icon absent" />;
      case 'late':
        return <FaClock className="status-icon late" />;
      case 'excused':
        return <FaExclamationCircle className="status-icon excused" />;
      default:
        return null;
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    const matchesMonth = recordDate.getMonth() === month && recordDate.getFullYear() === year;
    const matchesFilter = filter === 'all' || record.status === filter;
    return matchesMonth && matchesFilter;
  });

  const calculateStats = () => {
    const monthRecords = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month && recordDate.getFullYear() === year;
    });

    const total = monthRecords.length;
    const present = monthRecords.filter(r => r.status === 'present').length;
    const absent = monthRecords.filter(r => r.status === 'absent').length;
    const late = monthRecords.filter(r => r.status === 'late').length;
    const excused = monthRecords.filter(r => r.status === 'excused').length;
    const percentage = total > 0 ? ((present + late + excused) / total * 100).toFixed(1) : 0;

    return { total, present, absent, late, excused, percentage };
  };

  const stats = calculateStats();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <div className="page-header">
          <h1><FaCalendarCheck /> My Attendance</h1>
        </div>

        {/* Stats Cards */}
        <div className="attendance-stats">
          <div className="stat-card attendance-rate">
            <div className="stat-circle">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--primary-green)"
                  strokeWidth="3"
                  strokeDasharray={`${stats.percentage}, 100`}
                />
              </svg>
              <span className="percentage">{stats.percentage}%</span>
            </div>
            <p>Attendance Rate</p>
          </div>
          <div className="mini-stats">
            <div className="mini-stat present">
              <FaCheckCircle />
              <div>
                <span className="number">{stats.present}</span>
                <span className="label">Present</span>
              </div>
            </div>
            <div className="mini-stat late">
              <FaClock />
              <div>
                <span className="number">{stats.late}</span>
                <span className="label">Late</span>
              </div>
            </div>
            <div className="mini-stat absent">
              <FaTimesCircle />
              <div>
                <span className="number">{stats.absent}</span>
                <span className="label">Absent</span>
              </div>
            </div>
            <div className="mini-stat excused">
              <FaExclamationCircle />
              <div>
                <span className="number">{stats.excused}</span>
                <span className="label">Excused</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters card">
          <div className="filter-group">
            <label><FaFilter /> Filter by Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Month:</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {months.map((m, index) => (
                <option key={index} value={index}>{m}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Year:</label>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="attendance-table card">
          <h2>Attendance Records - {months[month]} {year}</h2>
          {filteredAttendance.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => {
                    const date = new Date(record.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                      <tr key={record._id}>
                        <td>{date.toLocaleDateString()}</td>
                        <td>{dayName}</td>
                        <td>
                          <div className="status-cell">
                            {getStatusIcon(record.status)}
                            <span className={`status-text ${record.status}`}>
                              {record.status}
                            </span>
                          </div>
                        </td>
                        <td>{record.checkInTime || '-'}</td>
                        <td>{record.checkOutTime || '-'}</td>
                        <td>{record.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-records">
              <FaCalendarCheck />
              <p>No attendance records found for {months[month]} {year}</p>
            </div>
          )}
        </div>

        {/* Calendar View */}
        <div className="calendar-legend card">
          <h3>Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color present"></span>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <span className="legend-color late"></span>
              <span>Late</span>
            </div>
            <div className="legend-item">
              <span className="legend-color absent"></span>
              <span>Absent</span>
            </div>
            <div className="legend-item">
              <span className="legend-color excused"></span>
              <span>Excused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;