// controllers/shiftController.js
const Shift = require('../models/Shift');

// Create shift
exports.createShift = async (req, res) => {
  try {
    const { name, department, startTime, endTime, maxCapacity } = req.body;

    // Check if shift already exists
    const existingShift = await Shift.findOne({ name, department });
    if (existingShift) {
      return res.status(400).json({ 
        message: `${name} shift already exists for ${department}` 
      });
    }

    const shift = new Shift({
      name,
      department,
      startTime,
      endTime,
      maxCapacity,
      createdBy: req.user._id
    });

    await shift.save();

    res.status(201).json({
      message: 'Shift created successfully',
      shift
    });
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all shifts
exports.getShifts = async (req, res) => {
  try {
    const { department, active } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (active === 'true') filter.isActive = true;

    // Junior admin can only see their department
    if (req.user.role === 'junior_admin' && req.user.department) {
      filter.department = req.user.department;
    }

    const shifts = await Shift.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ department: 1, name: 1 });

    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update shift
exports.updateShift = async (req, res) => {
  try {
    const { startTime, endTime, maxCapacity, isActive } = req.body;

    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime, maxCapacity, isActive },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.json({ message: 'Shift updated', shift });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete shift
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    shift.isActive = false;
    await shift.save();

    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shifts by department (public - for student registration)
exports.getShiftsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const shifts = await Shift.find({
      department,
      isActive: true
    }).select('name startTime endTime maxCapacity currentEnrollment');

    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};