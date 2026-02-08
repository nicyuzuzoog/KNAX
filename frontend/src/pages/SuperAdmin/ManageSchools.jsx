// pages/SuperAdmin/ManageSchools.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import {
  FaSchool,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaLayerGroup,
  FaSearch
} from 'react-icons/fa';
import './ManageSchools.css';

const departments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];
const provinces = ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'];

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    departments: [],
    location: '',
    district: '',
    province: 'Kigali',
    contactPhone: '',
    contactEmail: '',
    principalName: ''
  });

  const [classFormData, setClassFormData] = useState({
    name: '',
    department: '',
    level: 'Other'
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools/admin/all');
      setSchools(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentToggle = (dept) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('School name is required');
      return;
    }

    if (formData.departments.length === 0) {
      toast.error('Please select at least one department');
      return;
    }

    try {
      if (editingSchool) {
        await api.put(`/schools/${editingSchool._id}`, formData);
        toast.success('School updated successfully');
      } else {
        await api.post('/schools', formData);
        toast.success('School created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchSchools();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save school');
    }
  };

  const handleEdit = (school) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      departments: school.departments || [],
      location: school.location || '',
      district: school.district || '',
      province: school.province || 'Kigali',
      contactPhone: school.contactPhone || '',
      contactEmail: school.contactEmail || '',
      principalName: school.principalName || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (school) => {
    if (!window.confirm(`Are you sure you want to delete "${school.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/schools/${school._id}`);
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete school');
    }
  };

  const handleAddClass = (school) => {
    setSelectedSchool(school);
    setClassFormData({ name: '', department: '', level: 'Other' });
    setShowClassModal(true);
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    
    if (!classFormData.name.trim()) {
      toast.error('Class name is required');
      return;
    }

    try {
      await api.post(`/schools/${selectedSchool._id}/classes`, classFormData);
      toast.success('Class added successfully');
      setShowClassModal(false);
      fetchSchools();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add class');
    }
  };

  const resetForm = () => {
    setEditingSchool(null);
    setFormData({
      name: '',
      departments: [],
      location: '',
      district: '',
      province: 'Kigali',
      contactPhone: '',
      contactEmail: '',
      principalName: ''
    });
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="manage-schools-page">
        <div className="page-header">
          <div>
            <h1><FaSchool /> Manage Schools</h1>
            <p>Add and manage schools and their classes</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add School
          </button>
        </div>

        {/* Search */}
        <div className="search-card card">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search schools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-number">{schools.length}</span>
              <span className="stat-label">Total Schools</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {schools.reduce((acc, s) => acc + (s.classCount || 0), 0)}
              </span>
              <span className="stat-label">Total Classes</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {schools.reduce((acc, s) => acc + (s.studentCount || 0), 0)}
              </span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="schools-grid">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school) => (
              <div key={school._id} className={`school-card ${!school.isActive ? 'inactive' : ''}`}>
                <div className="school-header">
                  <h3>{school.name}</h3>
                  {!school.isActive && <span className="inactive-badge">Inactive</span>}
                </div>
                
                <div className="school-departments">
                  {school.departments?.map(dept => (
                    <span key={dept} className={`dept-badge ${dept.toLowerCase()}`}>
                      {dept}
                    </span>
                  ))}
                  {(!school.departments || school.departments.length === 0) && (
                    <span className="no-dept">No departments assigned</span>
                  )}
                </div>

                <div className="school-info">
                  {school.location && (
                    <p><FaMapMarkerAlt /> {school.location}</p>
                  )}
                  {school.contactPhone && (
                    <p><FaPhone /> {school.contactPhone}</p>
                  )}
                  {school.contactEmail && (
                    <p><FaEnvelope /> {school.contactEmail}</p>
                  )}
                </div>

                <div className="school-stats">
                  <div className="stat-item">
                    <FaLayerGroup />
                    <span>{school.classCount || 0} Classes</span>
                  </div>
                  <div className="stat-item">
                    <FaUsers />
                    <span>{school.studentCount || 0} Students</span>
                  </div>
                </div>

                <div className="school-actions">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleAddClass(school)}
                  >
                    <FaPlus /> Add Class
                  </button>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(school)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => handleDelete(school)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-schools">
              <FaSchool />
              <h3>No Schools Found</h3>
              <p>Add your first school to get started</p>
            </div>
          )}
        </div>

        {/* Add/Edit School Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>{editingSchool ? 'Edit School' : 'Add New School'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>School Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter school name"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Departments Offered *</label>
                    <div className="department-checkboxes">
                      {departments.map(dept => (
                        <label key={dept} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.departments.includes(dept)}
                            onChange={() => handleDepartmentToggle(dept)}
                          />
                          <span className={`dept-tag ${dept.toLowerCase()}`}>{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Kacyiru, Kigali"
                    />
                  </div>

                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g., Gasabo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Province</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="07X XXX XXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="school@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Principal Name</label>
                    <input
                      type="text"
                      name="principalName"
                      value={formData.principalName}
                      onChange={handleChange}
                      placeholder="Principal's full name"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaCheck /> {editingSchool ? 'Update School' : 'Add School'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Class Modal */}
        {showClassModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Add Class to {selectedSchool?.name}</h2>
                <button className="close-btn" onClick={() => setShowClassModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleClassSubmit} className="modal-body">
                <div className="form-group">
                  <label>Class Name *</label>
                  <input
                    type="text"
                    value={classFormData.name}
                    onChange={(e) => setClassFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., L4 SOD A, S5 NIT B"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department (Optional)</label>
                  <select
                    value={classFormData.department}
                    onChange={(e) => setClassFormData(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">-- Select Department --</option>
                    {selectedSchool?.departments?.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <select
                    value={classFormData.level}
                    onChange={(e) => setClassFormData(prev => ({ ...prev, level: e.target.value }))}
                  >
                    <option value="L3">L3</option>
                    <option value="L4">L4</option>
                    <option value="L5">L5</option>
                    <option value="L6">L6</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="S5">S5</option>
                    <option value="S6">S6</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowClassModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaPlus /> Add Class
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