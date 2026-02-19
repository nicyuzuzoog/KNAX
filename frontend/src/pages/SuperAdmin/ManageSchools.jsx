// src/pages/SuperAdmin/ManageSchools.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSchool,
  FaUsers,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserTie
} from 'react-icons/fa';
import './ManageSchools.css';

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    district: '',
    province: 'Kigali',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    departments: []
  });

  const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];
  const provinces = ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'];

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schools');
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      // Demo data
      setSchools([
        {
          _id: '1',
          name: 'Lycée de Kigali',
          location: 'Kigali City',
          district: 'Gasabo',
          province: 'Kigali',
          contactEmail: 'info@lyceekigali.rw',
          contactPhone: '+250788123456',
          principalName: 'Dr. Jean Baptiste',
          studentsCount: 45,
          departments: ['NIT', 'SOD'],
          createdAt: new Date()
        },
        {
          _id: '2',
          name: 'College Saint André',
          location: 'Huye',
          district: 'Huye',
          province: 'Southern',
          contactEmail: 'info@csa.rw',
          contactPhone: '+250788654321',
          principalName: 'Sr. Marie Claire',
          studentsCount: 32,
          departments: ['ACCOUNTING', 'CSA'],
          createdAt: new Date()
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
      if (editingSchool) {
        await api.put(`/schools/${editingSchool._id}`, formData);
        toast.success('School updated successfully!');
      } else {
        await api.post('/schools', formData);
        toast.success('School added successfully!');
      }
      setShowModal(false);
      fetchSchools();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (school) => {
    setEditingSchool(school);
    setFormData({
      name: school.name || '',
      location: school.location || '',
      district: school.district || '',
      province: school.province || 'Kigali',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      principalName: school.principalName || '',
      departments: school.departments || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await api.delete(`/schools/${id}`);
        toast.success('School deleted successfully');
        fetchSchools();
      } catch (error) {
        toast.error('Failed to delete school');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      district: '',
      province: 'Kigali',
      contactEmail: '',
      contactPhone: '',
      principalName: '',
      departments: []
    });
    setEditingSchool(null);
  };

  const toggleDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const filteredSchools = schools.filter(school =>
    school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="manage-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1><FaSchool /> Manage Schools</h1>
            <p>Manage partner schools and institutions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add School
          </button>
        </div>

        {/* Search & Stats */}
        <div className="page-toolbar">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-stats">
            <span className="stat-badge">
              <FaSchool /> {schools.length} Schools
            </span>
          </div>
        </div>

        {/* Schools Grid/Table */}
        <div className="data-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading schools...</p>
            </div>
          ) : filteredSchools.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Location</th>
                      <th>Principal</th>
                      <th>Contact</th>
                      <th>Departments</th>
                      <th>Students</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school) => (
                      <tr key={school._id}>
                        <td>
                          <div className="cell-with-icon">
                            <div className="cell-icon school">
                              <FaSchool />
                            </div>
                            <span className="cell-text">{school.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="location-cell">
                            <span>{school.location}</span>
                            <small>{school.district}, {school.province}</small>
                          </div>
                        </td>
                        <td>{school.principalName || 'N/A'}</td>
                        <td>
                          <div className="contact-cell">
                            <span>{school.contactEmail}</span>
                            <small>{school.contactPhone}</small>
                          </div>
                        </td>
                        <td>
                          <div className="dept-badges">
                            {school.departments?.map(dept => (
                              <span key={dept} className={`dept-badge ${dept.toLowerCase()}`}>
                                {dept}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="count-badge">
                            <FaUsers /> {school.studentsCount || 0}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon edit"
                              onClick={() => handleEdit(school)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn-icon delete"
                              onClick={() => handleDelete(school._id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-cards">
                {filteredSchools.map((school) => (
                  <div key={school._id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-icon">
                        <FaSchool />
                      </div>
                      <div className="mobile-card-title">
                        <h3>{school.name}</h3>
                        <span>{school.location}</span>
                      </div>
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <FaUserTie />
                        <span>{school.principalName || 'N/A'}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaEnvelope />
                        <span>{school.contactEmail}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaPhone />
                        <span>{school.contactPhone}</span>
                      </div>
                      <div className="mobile-card-row">
                        <FaUsers />
                        <span>{school.studentsCount || 0} Students</span>
                      </div>
                    </div>
                    <div className="mobile-card-footer">
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(school)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(school._id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <FaSchool />
              <h3>No Schools Found</h3>
              <p>Add your first school to get started</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus /> Add School
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSchool ? 'Edit School' : 'Add New School'}</h2>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label><FaSchool /> School Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter school name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label><FaMapMarkerAlt /> Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City/Town"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="District"
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label>Province</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FaUserTie /> Principal Name</label>
                    <input
                      type="text"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      placeholder="Principal's name"
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label><FaEnvelope /> Email *</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="contact@school.rw"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Phone *</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+250788000000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Departments Offered</label>
                  <div className="checkbox-group">
                    {departments.map(dept => (
                      <label key={dept} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.departments.includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                        />
                        <span className={`checkbox-label ${dept.toLowerCase()}`}>{dept}</span>
                      </label>
                    ))}
                  </div>
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
                    {submitting ? 'Saving...' : (editingSchool ? 'Update School' : 'Add School')}
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

export default ManageSchools;