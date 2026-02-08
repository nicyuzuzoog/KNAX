const Registration = require('../models/Registration');
const User = require('../models/User');

// Import email service (create if doesn't exist)
let emailService;
try {
  emailService = require('../services/emailService');
} catch (e) {
  emailService = null;
  console.log('Email service not configured yet');
}

// Create registration
exports.createRegistration = async (req, res) => {
  try {
    const { department, schoolId, classId } = req.body;

    const existingReg = await Registration.findOne({
      student: req.user._id,
      paymentStatus: { $in: ['pending', 'approved'] }
    });

    if (existingReg) {
      return res.status(400).json({ message: 'You already have an active registration' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Receipt photo is required' });
    }

    const registration = new Registration({
      student: req.user._id,
      department,
      school: schoolId,
      class: classId,
      receiptPhoto: req.file.path
    });

    await registration.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      school: schoolId,
      class: classId,
      department
    });

    // Send confirmation email if service exists
    if (emailService && emailService.sendRegistrationConfirmation) {
      const user = await User.findById(req.user._id);
      emailService.sendRegistrationConfirmation(user, registration);
    }

    res.status(201).json({ 
      message: 'Registration submitted successfully!', 
      registration 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all registrations (Admin)
exports.getAllRegistrations = async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};

    if (status) filter.paymentStatus = status;
    if (department) filter.department = department;

    if (req.user.role === 'junior_admin' && req.user.department) {
      filter.department = req.user.department;
    }

    const registrations = await Registration.find(filter)
      .populate('student', 'fullName email phone age')
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve/Reject registration
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.body;
    const registration = await Registration.findById(req.params.id)
      .populate('student');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.paymentStatus = status;
    registration.approvedBy = req.user._id;
    registration.approvedAt = new Date();

    if (status === 'approved') {
      registration.internshipStatus = 'active';
      registration.startDate = startDate || new Date();
      registration.endDate = endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      // Send approval email if service exists
      if (emailService && emailService.sendApprovalEmail) {
        emailService.sendApprovalEmail(registration.student, registration);
      }
    }

    await registration.save();

    res.json({ message: `Registration ${status}`, registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete internship and send certificate
exports.completeInternship = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('student');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.internshipStatus = 'completed';
    await registration.save();

    // Send certificate if service exists
    if (emailService && emailService.sendCertificate) {
      await emailService.sendCertificate(registration.student, registration);
      res.json({ message: 'Internship completed and certificate sent!' });
    } else {
      res.json({ message: 'Internship completed!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's registration
exports.getMyRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({ student: req.user._id })
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName');

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email phone age')
      .populate('school', 'name location')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};