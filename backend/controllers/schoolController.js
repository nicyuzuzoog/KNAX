const School = require('../models/School');
const Class = require('../models/Class');

// Add school
exports.addSchool = async (req, res) => {
  try {
    const { name, location } = req.body;

    let school = await School.findOne({ name });
    if (school) {
      return res.status(400).json({ message: 'School already exists' });
    }

    school = new School({
      name,
      location,
      addedBy: req.user._id
    });

    await school.save();
    res.status(201).json({ message: 'School added successfully', school });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all schools
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find({ isActive: true })
      .populate('addedBy', 'fullName');
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add class to school
exports.addClass = async (req, res) => {
  try {
    const { name, schoolId } = req.body;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if class already exists in this school
    let existingClass = await Class.findOne({ name, school: schoolId });
    if (existingClass) {
      return res.status(400).json({ message: 'Class already exists in this school' });
    }

    const newClass = new Class({
      name,
      school: schoolId,
      addedBy: req.user._id
    });

    await newClass.save();
    res.status(201).json({ message: 'Class added successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get classes by school
exports.getClassesBySchool = async (req, res) => {
  try {
    const classes = await Class.find({ 
      school: req.params.schoolId, 
      isActive: true 
    }).populate('school', 'name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete school
exports.deleteSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Soft delete
    school.isActive = false;
    await school.save();

    // Also deactivate all classes in this school
    await Class.updateMany({ school: req.params.id }, { isActive: false });

    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classItem.isActive = false;
    await classItem.save();

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};