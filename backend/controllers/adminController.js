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

// Create junior admin (Super admin only) - FIXED: No manual password hashing
exports.createJuniorAdmin = async (req, res) => {
  try {
    console.log('========================================');
    console.log('📝 CREATE JUNIOR ADMIN REQUEST');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('========================================');

    const { fullName, email, password, phone, department, age, permissions } = req.body;

    // Validate required fields
    const missing = [];
    if (!fullName || !fullName.trim()) missing.push('fullName');
    if (!email || !email.trim()) missing.push('email');
    if (!password) missing.push('password');
    if (!phone || !phone.trim()) missing.push('phone');
    if (!department) missing.push('department');

    if (missing.length > 0) {
      console.log('❌ Missing fields:', missing);
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}`,
        missing
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Parse and validate age if provided
    let ageNum = null;
    if (age !== undefined && age !== null && age !== '') {
      ageNum = parseInt(age);
      if (isNaN(ageNum)) {
        return res.status(400).json({ message: 'Age must be a valid number' });
      }
      if (ageNum < 18 || ageNum > 100) {
        return res.status(400).json({ message: 'Age must be between 18 and 100' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user - DO NOT HASH PASSWORD HERE! Let the pre-save hook handle it
    const newAdmin = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Plain password - will be hashed by pre-save hook
      phone: phone.trim(),
      age: ageNum || 25, // Default age for admin
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
    console.log('✅ Junior admin created successfully:', newAdmin.email);

    // Send email notification (optional)
    if (emailService && emailService.sendJuniorAdminWelcome) {
      try {
        await emailService.sendJuniorAdminWelcome(newAdmin, password);
        console.log('✅ Welcome email sent to:', email);
      } catch (emailError) {
        console.error('⚠️ Failed to send email:', emailError.message);
      }
    }

    console.log('========================================');
    console.log('✅ CREATE JUNIOR ADMIN COMPLETE');
    console.log('========================================');

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
      return res.status(400).json({ 
        message: `This ${field} is already registered.` 
      });
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
    if (!admin || admin.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    // Update fields
    if (fullName) admin.fullName = fullName.trim();
    if (email) admin.email = email.toLowerCase().trim();
    if (phone) admin.phone = phone.trim();
    if (age) admin.age = parseInt(age);
    if (department) admin.department = department;
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    
    // Update permissions
    if (permissions) {
      admin.permissions = {
        ...admin.permissions,
        ...permissions
      };
    }
    
    // Update password if provided (will be hashed by pre-save hook)
    if (password && password.length >= 6) {
      admin.password = password;
    }

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
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
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
    if (!admin || admin.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({ 
      message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: admin.isActive 
    });
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
    if (!admin || admin.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    admin.permissions = {
      ...admin.permissions,
      ...permissions
    };

    await admin.save();

    res.json({ 
      message: 'Permissions updated successfully', 
      permissions: admin.permissions 
    });
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
    if (!admin || admin.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

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

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    // Set new password (will be hashed by pre-save hook)
    admin.password = newPassword;
    await admin.save();

    console.log('✅ Password reset for:', admin.email);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard stats (Super admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const approvedRegistrations = await Registration.countDocuments({ paymentStatus: 'approved' });
    const pendingRegistrations = await Registration.countDocuments({ paymentStatus: 'pending' });
    const rejectedRegistrations = await Registration.countDocuments({ paymentStatus: 'rejected' });
    
    const appliedStudents = await Registration.countDocuments();
    const registeredUsers = await User.countDocuments({ role: 'student' });
    const studentsNotApplied = Math.max(0, registeredUsers - appliedStudents);
    
    const totalEarnings = await Registration.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    const departmentStats = await Registration.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { _id: '$department', count: { $sum: 1 }, earnings: { $sum: '$amountPaid' } } }
    ]);

    const shiftStats = await Registration.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { _id: '$shift', count: { $sum: 1 } } }
    ]);

    const juniorAdminsCount = await User.countDocuments({ role: 'junior_admin' });
    const activeJuniorAdmins = await User.countDocuments({ role: 'junior_admin', isActive: true });
    const studentsCount = await User.countDocuments({ role: 'student' });

    res.json({
      totalRegistrations,
      approvedRegistrations,
      pendingRegistrations,
      rejectedRegistrations,
      totalEarnings: totalEarnings[0]?.total || 0,
      departmentStats,
      shiftStats,
      juniorAdminsCount,
      activeJuniorAdmins,
      studentsCount,
      appliedStudents,
      studentsNotApplied
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate financial report
exports.generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { paymentStatus: 'approved' };
    
    if (startDate && endDate) {
      query.approvedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const registrations = await Registration.find(query)
      .populate('student', 'fullName email phone')
      .populate('school', 'name')
      .populate('class', 'name')
      .populate('approvedBy', 'fullName')
      .sort({ approvedAt: -1 });

    const totalAmount = registrations.reduce((sum, reg) => sum + (reg.amountPaid || 30000), 0);

    const report = {
      generatedAt: new Date(),
      period: {
        start: startDate || 'All time',
        end: endDate || 'Present'
      },
      summary: {
        totalTransactions: registrations.length,
        totalAmount: totalAmount,
        averagePerTransaction: registrations.length > 0 ? totalAmount / registrations.length : 0
      },
      transactions: registrations.map(reg => ({
        date: reg.approvedAt || reg.createdAt,
        student: reg.student?.fullName,
        email: reg.student?.email,
        phone: reg.student?.phone,
        department: reg.department,
        shift: reg.shift,
        school: reg.school?.name,
        class: reg.class?.name,
        amount: reg.amountPaid || 30000,
        approvedBy: reg.approvedBy?.fullName,
        receiptPhoto: reg.receiptPhoto
      }))
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { status } = req.query;
    
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    const registrations = await Registration.find()
      .populate('school', 'name')
      .populate('class', 'name');

    const studentsWithStatus = students.map(student => {
      const reg = registrations.find(r => r.student?.toString() === student._id.toString());
      return {
        ...student.toObject(),
        hasApplied: !!reg,
        registration: reg || null,
        applicationStatus: reg ? reg.paymentStatus : 'not_applied'
      };
    });

    let filtered = studentsWithStatus;
    if (status === 'applied') {
      filtered = studentsWithStatus.filter(s => s.hasApplied);
    } else if (status === 'not_applied') {
      filtered = studentsWithStatus.filter(s => !s.hasApplied);
    } else if (status === 'approved') {
      filtered = studentsWithStatus.filter(s => s.applicationStatus === 'approved');
    } else if (status === 'pending') {
      filtered = studentsWithStatus.filter(s => s.applicationStatus === 'pending');
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};