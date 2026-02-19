// src/pages/SuperAdmin/AllStudents.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaSearch, 
  FaDownload, 
  FaEye,
  FaFilter,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTimes,
  FaFileExcel
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
      // Demo data
      setStudents([
        {
          _id: '1',
          fullName: 'Jean Pierre Habimana',
          email: 'jeanpierre@gmail.com',
          phone: '0788123456',
          age: 22,
          school: { name: 'Lycée de Kigali' },
          class: { name: 'S6 MPC' },
          department: 'SOD',
          registration: {
            paymentStatus: 'approved',
            internshipStatus: 'active',
            shift: 'morning',
            createdAt: new Date('2024-01-15')
          },
          createdAt: new Date('2024-01-10')
        },
        {
          _id: '2',
          fullName: 'Marie Claire Uwimana',
          email: 'marieclaire@gmail.com',
          phone: '0788654321',
          age: 20,
          school: { name: 'College Saint André' },
          class: { name: 'L6 Accounting' },
          department: 'ACCOUNTING',
          registration: {
            paymentStatus: 'pending',
            internshipStatus: 'pending',
            shift: 'afternoon',
            createdAt: new Date('2024-02-01')
          },
          createdAt: new Date('2024-01-28')
        },
        {
          _id: '3',
          fullName: 'Emmanuel Nsengiyumva',
          email: 'emmanuel@gmail.com',
          phone: '0788111222',
          age: 23,
          school: { name: 'IPRC Kigali' },
          class: { name: 'Level 5 NIT' },
          department: 'NIT',
          registration: {
            paymentStatus: 'approved',
            internshipStatus: 'active',
            shift: 'morning',
            createdAt: new Date('2024-01-20')
          },
          createdAt: new Date('2024-01-18')
        },
        {
          _id: '4',
          fullName: 'Alice Mukamana',
          email: 'alice@gmail.com',
          phone: '0788333444',
          age: 21,
          school: { name: 'GS Remera' },
          class: { name: 'S5 MCB' },
          department: 'CSA',
          registration: {
            paymentStatus: 'rejected',
            internshipStatus: 'cancelled',
            shift: 'morning',
            createdAt: new Date('2024-01-25')
          },
          createdAt: new Date('2024-01-22')
        }
      ]);
    } finally {
      setLoading(false);
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

        {/* Results Info */}
        <div className="results-info">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
        </div>

        {/* Students Data */}
        <div className="data-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <>
              {/* Desktop Table */}
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
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {student.fullName?.charAt(0).toUpperCase()}
                            </div>
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
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>{getStatusBadge(student.registration?.paymentStatus)}</td>
                        <td>
                          {student.registration?.createdAt 
                            ? new Date(student.registration.createdAt).toLocaleDateString()
                            : '-'
                          }
                        </td>
                        <td>
                          <button 
                            className="btn-icon view"
                            onClick={() => viewStudentDetails(student)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-cards">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="student-avatar large">
                        {student.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="mobile-card-title">
                        <h3>{student.fullName}</h3>
                        <span>Age: {student.age}</span>
                      </div>
                      {getStatusBadge(student.registration?.paymentStatus)}
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <FaEnvelope />
                        <span>{student.email}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaPhone />
                        <span>{student.phone}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaSchool />
                        <span>{student.school?.name || 'N/A'}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaBuilding />
                        <span>
                          {student.department ? (
                            <span className={`dept-badge ${student.department.toLowerCase()}`}>
                              {student.department}
                            </span>
                          ) : 'N/A'}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <FaCalendarAlt />
                        <span>
                          Applied: {student.registration?.createdAt 
                            ? new Date(student.registration.createdAt).toLocaleDateString()
                            : 'Not Applied'}
                        </span>
                      </div>
                    </div>
                    <div className="mobile-card-footer">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => viewStudentDetails(student)}
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <FaUserGraduate />
              <h3>No Students Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Student Detail Modal */}
        {showDetailModal && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Details</h2>
                <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-header">
                  <div className="student-avatar extra-large">
                    {selectedStudent.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="detail-header-info">
                    <h3>{selectedStudent.fullName}</h3>
                    {getStatusBadge(selectedStudent.registration?.paymentStatus)}
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-section">
                    <h4>Personal Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedStudent.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedStudent.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{selectedStudent.age} years</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Education</h4>
                    <div className="detail-row">
                      <span className="detail-label">School:</span>
                      <span className="detail-value">{selectedStudent.school?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Class:</span>
                      <span className="detail-value">{selectedStudent.class?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">
                        {selectedStudent.department ? (
                          <span className={`dept-badge ${selectedStudent.department.toLowerCase()}`}>
                            {selectedStudent.department}
                          </span>
                        ) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {selectedStudent.registration && (
                    <div className="detail-section">
                      <h4>Registration Info</h4>
                      <div className="detail-row">
                        <span className="detail-label">Payment Status:</span>
                        <span className="detail-value">
                          {getStatusBadge(selectedStudent.registration.paymentStatus)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Internship Status:</span>
                        <span className="detail-value">{selectedStudent.registration.internshipStatus}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Shift:</span>
                        <span className="detail-value">{selectedStudent.registration.shift}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Applied On:</span>
                        <span className="detail-value">
                          {new Date(selectedStudent.registration.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllStudents;