// controllers/adminController.js
const User = require('../models/User');
const Registration = require('../models/Registration');

// Import email service safely
let emailService;
try {
  emailService = require('../services/emailService');
  console.log('✅ Email service loaded');
} catch (e) {
  console.log('⚠️ Email service not available, will skip email notifications');
  emailService = null;
}

// Create junior admin (Super admin only)
exports.createJuniorAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, department, age, permissions } = req.body;

    const missing = [];
    if (!fullName?.trim()) missing.push('fullName');
    if (!email?.trim()) missing.push('email');
    if (!password) missing.push('password');
    if (!phone?.trim()) missing.push('phone');
    if (!department) missing.push('department');

    if (missing.length > 0) return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}`, missing });

    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    let ageNum = null;
    if (age !== undefined && age !== null && age !== '') {
      ageNum = parseInt(age);
      if (isNaN(ageNum)) return res.status(400).json({ message: 'Age must be a valid number' });
      if (ageNum < 18 || ageNum > 100) return res.status(400).json({ message: 'Age must be between 18 and 100' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const newAdmin = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      age: ageNum || 25,
      department,
      role: 'junior_admin',
      permissions: {
        canApprovePayments: permissions?.canApprovePayments ?? true,
        canRejectPayments: permissions?.canRejectPayments ?? true,
        canViewRegistrations: permissions?.canViewRegistrations ?? true,
        canManageAttendance: permissions?.canManageAttendance ?? true,
        canManageTimetable: permissions?.canManageTimetable ?? true,
        canManageShifts: permissions?.canManageShifts ?? true,
        canPostAnnouncements: permissions?.canPostAnnouncements ?? true,
        canViewFinancials: permissions?.canViewFinancials ?? false,
        canUploadReceipts: permissions?.canUploadReceipts ?? true,
        canCreateSchoolRegister: permissions?.canCreateSchoolRegister ?? true
      },
      assignedBy: req.user?._id,
      isActive: true
    });

    await newAdmin.save();

    if (emailService?.sendJuniorAdminWelcome) {
      try {
        await emailService.sendJuniorAdminWelcome(newAdmin, password);
      } catch (emailError) {
        console.error('⚠️ Failed to send email:', emailError.message);
      }
    }

    res.status(201).json({
      message: 'Junior admin created successfully!',
      user: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
        age: newAdmin.age,
        role: newAdmin.role,
        department: newAdmin.department,
        permissions: newAdmin.permissions,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt
      }
    });

  } catch (error) {
    console.error('❌ CREATE JUNIOR ADMIN ERROR:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `This ${field} is already registered.` });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update junior admin
exports.updateJuniorAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, phone, age, department, permissions, isActive } = req.body;

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') return res.status(404).json({ message: 'Junior admin not found' });

    if (fullName) admin.fullName = fullName.trim();
    if (email) admin.email = email.toLowerCase().trim();
    if (phone) admin.phone = phone.trim();
    if (age) admin.age = parseInt(age);
    if (department) admin.department = department;
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
    if (password?.length >= 6) admin.password = password;

    await admin.save();

    res.json({
      message: 'Junior admin updated successfully',
      user: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        age: admin.age,
        role: admin.role,
        department: admin.department,
        permissions: admin.permissions,
        isActive: admin.isActive
      }
    });

  } catch (error) {
    console.error('❌ Update admin error:', error);
    if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all junior admins
exports.getJuniorAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'junior_admin' })
      .select('-password')
      .populate('assignedBy', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle junior admin status
exports.toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') return res.status(404).json({ message: 'Junior admin not found' });

    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({ message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`, isActive: admin.isActive });
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update junior admin permissions
exports.updateAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') return res.status(404).json({ message: 'Junior admin not found' });

    admin.permissions = { ...admin.permissions, ...permissions };
    await admin.save();

    res.json({ message: 'Permissions updated successfully', permissions: admin.permissions });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete junior admin
exports.deleteJuniorAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') return res.status(404).json({ message: 'Junior admin not found' });

    await User.findByIdAndDelete(id);
    res.json({ message: 'Junior admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset admin password
exports.resetAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') return res.status(404).json({ message: 'Junior admin not found' });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students safely
exports.getAllStudents = async (req, res) => {
  try {
    const { status } = req.query;

    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    // Fetch registrations but only populate existing fields
    const registrations = await Registration.find()
      .populate('school', 'name')
      .populate('class', 'name') // safe if class field exists; will ignore if missing
      .populate('student', 'fullName email phone');

    const studentsWithStatus = students.map(student => {
      const reg = registrations.find(r => r.student?._id.toString() === student._id.toString());
      return {
        ...student.toObject(),
        hasApplied: !!reg,
        registration: reg || null,
        applicationStatus: reg?.paymentStatus || 'not_applied',
        class: reg?.class?.name || null,
        school: reg?.school?.name || null
      };
    });

    let filtered = studentsWithStatus;
    if (status === 'applied') filtered = studentsWithStatus.filter(s => s.hasApplied);
    else if (status === 'not_applied') filtered = studentsWithStatus.filter(s => !s.hasApplied);
    else if (status === 'approved') filtered = studentsWithStatus.filter(s => s.applicationStatus === 'approved');
    else if (status === 'pending') filtered = studentsWithStatus.filter(s => s.applicationStatus === 'pending');

    res.json(filtered);

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate financial report safely
exports.generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { paymentStatus: 'approved' };
    if (startDate && endDate) {
      query.approvedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const registrations = await Registration.find(query)
      .populate('student', 'fullName email phone')
      .populate('school', 'name')
      .populate('class', 'name') // safe if field exists
      .populate('approvedBy', 'fullName')
      .sort({ approvedAt: -1 });

    const totalAmount = registrations.reduce((sum, reg) => sum + (reg.amountPaid || 30000), 0);

    const report = {
      generatedAt: new Date(),
      period: { start: startDate || 'All time', end: endDate || 'Present' },
      summary: {
        totalTransactions: registrations.length,
        totalAmount,
        averagePerTransaction: registrations.length > 0 ? totalAmount / registrations.length : 0
      },
      transactions: registrations.map(reg => ({
        date: reg.approvedAt || reg.createdAt,
        student: reg.student?.fullName,
        email: reg.student?.email,
        phone: reg.student?.phone,
        department: reg.department,
        shift: reg.shift,
        school: reg.school?.name || null,
        class: reg.class?.name || null,
        amount: reg.amountPaid || 30000,
        approvedBy: reg.approvedBy?.fullName || null,
        receiptPhoto: reg.receiptPhoto
      }))
    };

    res.json(report);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
