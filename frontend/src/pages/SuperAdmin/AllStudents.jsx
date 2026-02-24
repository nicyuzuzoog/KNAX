// src/pages/SuperAdmin/AllStudents.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, FaSearch, FaDownload, FaEye, FaFilter, FaUserGraduate,
  FaEnvelope, FaPhone, FaSchool, FaBuilding, FaCalendarAlt,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTimes, FaFileExcel,
  FaTrash, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import './AllStudents.css';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students from server');
    } finally {
      setLoading(false);
    }
  };

  // Activate/Deactivate student
  const toggleStudentStatus = async (studentId, currentStatus) => {
    try {
      const response = await api.patch(`/admin/students/${studentId}/toggle-status`);
      toast.success(response.data.message);
      fetchStudents();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to toggle student status');
    }
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await api.delete(`/admin/students/${studentId}`);
      toast.success(response.data.message);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'School', 'Department', 'Status', 'Date'];
    const csvData = filteredStudents.map(s => [
      s.fullName,
      s.email,
      s.phone,
      s.school?.name || 'N/A',
      s.department || 'N/A',
      s.registration?.paymentStatus || 'not_applied',
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Students exported successfully!');
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
      case 'pending':
        return <span className="status-badge pending"><FaHourglassHalf /> Pending</span>;
      case 'rejected':
        return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
      default:
        return <span className="status-badge not-applied">Not Applied</span>;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm) ||
      student.school?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || 
      student.registration?.paymentStatus === filterStatus ||
      (filterStatus === 'not_applied' && !student.registration);

    const matchesDepartment = filterDepartment === 'all' || 
      student.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: students.length,
    approved: students.filter(s => s.registration?.paymentStatus === 'approved').length,
    pending: students.filter(s => s.registration?.paymentStatus === 'pending').length,
    rejected: students.filter(s => s.registration?.paymentStatus === 'rejected').length
  };

  return (
    <AdminLayout>
      <div className="students-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1><FaUsers /> All Students</h1>
            <p>View and manage all enrolled students</p>
          </div>
          <button className="btn btn-primary" onClick={exportToCSV}>
            <FaFileExcel /> Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="mini-stat-card">
            <div className="mini-stat-icon total"><FaUsers /></div>
            <div className="mini-stat-info">
              <h3>{stats.total}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon approved"><FaCheckCircle /></div>
            <div className="mini-stat-info">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon pending"><FaHourglassHalf /></div>
            <div className="mini-stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon rejected"><FaTimesCircle /></div>
            <div className="mini-stat-info">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, email, phone, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
          <div className="filter-group">
            <div className="filter-item">
              <label><FaFilter /> Status:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="not_applied">Not Applied</option>
              </select>
            </div>
            <div className="filter-item">
              <label><FaBuilding /> Department:</label>
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="data-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>School</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">{student.fullName?.charAt(0)}</div>
                          <div className="student-info">
                            <span className="student-name">{student.fullName}</span>
                            <small>Age: {student.age}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span><FaEnvelope /> {student.email}</span>
                          <small><FaPhone /> {student.phone}</small>
                        </div>
                      </td>
                      <td>
                        <div className="school-cell">
                          <span>{student.school?.name || 'N/A'}</span>
                          <small>{student.class?.name || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        {student.department ? (
                          <span className={`dept-badge ${student.department.toLowerCase()}`}>
                            {student.department}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td>{getStatusBadge(student.registration?.paymentStatus)}</td>
                      <td>{student.registration?.createdAt ? new Date(student.registration.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <button className="btn-icon view" onClick={() => viewStudentDetails(student)} title="View Details">
                          <FaEye />
                        </button>
                        <button className="btn-icon toggle" onClick={() => toggleStudentStatus(student._id, student.isActive)}>
                          {student.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button className="btn-icon delete" onClick={() => deleteStudent(student._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaUserGraduate />
              <h3>No Students Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-container large" onClick={e => e.stopPropagation()}>
              {/* Modal content same as your current modal */}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllStudents;
