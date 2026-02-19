// controllers/registrationController.js
const Registration = require('../models/Registration');
const User = require('../models/User');

// Get all registrations
exports.getRegistrations = async (req, res) => {
  try {
    const { status, department } = req.query;
    const query = {};

    if (status) {
      query.paymentStatus = status;
    }

    // Filter by department for junior admins
    if (req.user.role === 'junior_admin' && req.user.department) {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    const registrations = await Registration.find(query)
      .populate('student', 'fullName email phone age')
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single registration
exports.getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email phone age')
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my registration (for students)
exports.getMyRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({ student: req.user._id })
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName');

    res.json(registration);
  } catch (error) {
    console.error('Get my registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create registration
exports.createRegistration = async (req, res) => {
  try {
    const { school, class: classId, department, shift, startDate, endDate, amountPaid } = req.body;

    // Check for existing registration
    const existing = await Registration.findOne({
      student: req.user._id,
      paymentStatus: { $in: ['pending', 'approved'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have an active registration' });
    }

    const registration = new Registration({
      student: req.user._id,
      school,
      class: classId,
      department,
      shift,
      startDate,
      endDate,
      amountPaid: amountPaid || 30000,
      paymentStatus: 'pending'
    });

    if (req.file) {
      registration.receiptPhoto = `/uploads/receipts/${req.file.filename}`;
    }

    await registration.save();
    await registration.populate(['student', 'school', 'class']);

    res.status(201).json({
      message: 'Registration submitted successfully',
      registration
    });
  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update registration
exports.updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot update approved/rejected registration' });
    }

    const updates = req.body;
    
    if (req.file) {
      updates.receiptPhoto = `/uploads/receipts/${req.file.filename}`;
    }

    Object.keys(updates).forEach(key => {
      registration[key] = updates[key];
    });

    await registration.save();
    await registration.populate(['student', 'school', 'class']);

    res.json({ message: 'Registration updated', registration });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete registration
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration deleted' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// UPDATE PAYMENT STATUS (Generic handler)
// This handles: /registrations/:id/status
// ============================================
exports.updatePaymentStatus = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('📝 UPDATE PAYMENT STATUS');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('User:', req.user?.email, req.user?.role);
    console.log('========================================\n');

    const { status, paymentStatus, reason } = req.body;
    const newStatus = status || paymentStatus;

    if (!newStatus) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (!['pending', 'approved', 'rejected'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, approved, or rejected' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check permissions
    const isSuperAdmin = req.user.role === 'super_admin';
    const canApprove = req.user.permissions?.canApprovePayments === true;
    const canReject = req.user.permissions?.canRejectPayments === true;

    if (!isSuperAdmin && !canApprove && !canReject) {
      return res.status(403).json({ message: 'You do not have permission to update payment status' });
    }

    // Check department for junior admin
    if (req.user.role === 'junior_admin' && req.user.department) {
      if (registration.department !== req.user.department) {
        return res.status(403).json({ message: 'You can only manage registrations for your department' });
      }
    }

    // Rejection requires reason
    if (newStatus === 'rejected' && !reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    // Update the registration
    registration.paymentStatus = newStatus;

    if (newStatus === 'approved') {
      registration.approvedBy = req.user._id;
      registration.approvedAt = new Date();
      registration.internshipStatus = 'active';
      registration.rejectionReason = undefined;
    } else if (newStatus === 'rejected') {
      registration.rejectedBy = req.user._id;
      registration.rejectedAt = new Date();
      registration.rejectionReason = reason;
      registration.internshipStatus = 'pending';
    }

    await registration.save();
    await registration.populate(['student', 'school', 'approvedBy', 'rejectedBy']);

    console.log(`✅ Status updated to: ${newStatus}`);

    res.json({
      success: true,
      message: `Payment ${newStatus} successfully`,
      registration
    });

  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// APPROVE PAYMENT
// This handles: /registrations/:id/approve
// ============================================
exports.approvePayment = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('✅ APPROVE PAYMENT REQUEST');
    console.log('ID:', req.params.id);
    console.log('User:', req.user?.email, req.user?.role);
    console.log('========================================\n');

    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email phone');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check permission
    const isSuperAdmin = req.user.role === 'super_admin';
    const hasPermission = req.user.permissions?.canApprovePayments === true;

    if (!isSuperAdmin && !hasPermission) {
      return res.status(403).json({ message: 'You do not have permission to approve payments' });
    }

    // Check department
    if (req.user.role === 'junior_admin' && req.user.department) {
      if (registration.department !== req.user.department) {
        return res.status(403).json({ message: 'You can only approve payments for your department' });
      }
    }

    if (registration.paymentStatus === 'approved') {
      return res.status(400).json({ message: 'Payment already approved' });
    }

    // Update
    registration.paymentStatus = 'approved';
    registration.approvedBy = req.user._id;
    registration.approvedAt = new Date();
    registration.internshipStatus = 'active';

    await registration.save();
    await registration.populate('approvedBy', 'fullName');

    console.log('✅ PAYMENT APPROVED');

    res.json({
      success: true,
      message: `Payment approved for ${registration.student?.fullName}`,
      registration
    });

  } catch (error) {
    console.error('❌ Approve error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// REJECT PAYMENT
// This handles: /registrations/:id/reject
// ============================================
exports.rejectPayment = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('❌ REJECT PAYMENT REQUEST');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('========================================\n');

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check permission
    const isSuperAdmin = req.user.role === 'super_admin';
    const hasPermission = req.user.permissions?.canRejectPayments === true;

    if (!isSuperAdmin && !hasPermission) {
      return res.status(403).json({ message: 'You do not have permission to reject payments' });
    }

    // Check department
    if (req.user.role === 'junior_admin' && req.user.department) {
      if (registration.department !== req.user.department) {
        return res.status(403).json({ message: 'You can only reject payments for your department' });
      }
    }

    if (registration.paymentStatus === 'rejected') {
      return res.status(400).json({ message: 'Payment already rejected' });
    }

    registration.paymentStatus = 'rejected';
    registration.rejectionReason = reason.trim();
    registration.rejectedBy = req.user._id;
    registration.rejectedAt = new Date();

    await registration.save();

    console.log('✅ PAYMENT REJECTED');

    res.json({
      success: true,
      message: 'Payment rejected',
      registration
    });

  } catch (error) {
    console.error('❌ Reject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};