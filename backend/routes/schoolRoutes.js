// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminOnly, superAdminOnly } = require('../middleware/auth');
const School = require('../models/School');
const Class = require('../models/Class');

// Get all schools (public - for registration form)
router.get('/', async (req, res) => {
  try {
    const { department, active } = req.query;
    
    const query = {};
    
    // Filter by active status
    if (active !== 'false') {
      query.isActive = true;
    }
    
    // Filter by department if provided
    if (department) {
      query.departments = department;
    }
    
    const schools = await School.find(query)
      .select('name departments location district studentsCount')
      .sort({ name: 1 });
    
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schools by department (for student registration)
router.get('/by-department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    
    // Validate department
    const validDepartments = ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }
    
    const schools = await School.find({
      departments: department,
      isActive: true
    })
    .select('name departments location district')
    .sort({ name: 1 });
    
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools by department:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single school with classes
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get classes for a school
router.get('/:id/classes', async (req, res) => {
  try {
    const { department } = req.query;
    
    const query = { 
      school: req.params.id,
      isActive: true
    };
    
    // Optionally filter by department
    if (department) {
      query.department = department;
    }
    
    const classes = await Class.find(query)
      .select('name level department studentsCount')
      .sort({ name: 1 });
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create school (Super Admin only)
router.post('/', auth, superAdminOnly, async (req, res) => {
  try {
    const { 
      name, 
      departments, 
      location, 
      district, 
      province,
      contactPhone, 
      contactEmail, 
      principalName 
    } = req.body;

    // Check if school already exists
    const existingSchool = await School.findOne({ name: name.trim() });
    if (existingSchool) {
      return res.status(400).json({ message: 'School with this name already exists' });
    }

    const school = new School({
      name: name.trim(),
      departments: departments || [],
      location,
      district,
      province,
      contactPhone,
      contactEmail,
      principalName,
      addedBy: req.user._id
    });

    await school.save();

    res.status(201).json({
      message: 'School created successfully',
      school
    });
  } catch (error) {
    console.error('Error creating school:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'School name already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update school (Super Admin only)
router.put('/:id', auth, superAdminOnly, async (req, res) => {
  try {
    const { 
      name, 
      departments, 
      location, 
      district,
      province,
      contactPhone, 
      contactEmail, 
      principalName,
      isActive 
    } = req.body;

    const school = await School.findById(req.params.id);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Update fields
    if (name) school.name = name.trim();
    if (departments) school.departments = departments;
    if (location !== undefined) school.location = location;
    if (district !== undefined) school.district = district;
    if (province !== undefined) school.province = province;
    if (contactPhone !== undefined) school.contactPhone = contactPhone;
    if (contactEmail !== undefined) school.contactEmail = contactEmail;
    if (principalName !== undefined) school.principalName = principalName;
    if (isActive !== undefined) school.isActive = isActive;

    await school.save();

    res.json({
      message: 'School updated successfully',
      school
    });
  } catch (error) {
    console.error('Error updating school:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'School name already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete school (Super Admin only)
router.delete('/:id', auth, superAdminOnly, async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if school has registrations
    const Registration = require('../models/Registration');
    const registrations = await Registration.countDocuments({ school: req.params.id });
    
    if (registrations > 0) {
      // Soft delete - just deactivate
      school.isActive = false;
      await school.save();
      return res.json({ 
        message: 'School deactivated (has existing registrations)',
        school 
      });
    }

    // Hard delete if no registrations
    await School.findByIdAndDelete(req.params.id);
    
    // Also delete associated classes
    await Class.deleteMany({ school: req.params.id });

    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add class to school (Super Admin only)
router.post('/:id/classes', auth, superAdminOnly, async (req, res) => {
  try {
    const { name, department, level } = req.body;

    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if class already exists in this school
    const existingClass = await Class.findOne({ 
      name: name.trim(), 
      school: req.params.id 
    });
    
    if (existingClass) {
      return res.status(400).json({ message: 'Class already exists in this school' });
    }

    const newClass = new Class({
      name: name.trim(),
      school: req.params.id,
      department,
      level
    });

    await newClass.save();

    res.status(201).json({
      message: 'Class added successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all schools with stats (Admin only)
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const schools = await School.find()
      .populate('addedBy', 'fullName')
      .sort({ createdAt: -1 });

    // Get class count for each school
    const schoolsWithStats = await Promise.all(
      schools.map(async (school) => {
        const classCount = await Class.countDocuments({ school: school._id });
        const Registration = require('../models/Registration');
        const studentCount = await Registration.countDocuments({ 
          school: school._id,
          paymentStatus: 'approved'
        });
        
        return {
          ...school.toObject(),
          classCount,
          studentCount
        };
      })
    );

    res.json(schoolsWithStats);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;