const User = require('../models/User');
const Registration = require('../models/Registration');
const bcrypt = require('bcryptjs');

// Create junior admin (Super admin only)
exports.createJuniorAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, department, permissions } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      department,
      role: 'junior_admin',
      permissions: permissions || {
        canApprovePayments: true,
        canRejectPayments: true,
        canViewRegistrations: true,
        canManageAttendance: true,
        canViewFinancials: false
      },
      assignedBy: req.user._id
    });

    await user.save();

    res.status(201).json({
      message: 'Junior admin created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update junior admin permissions
exports.updateAdminPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    user.permissions = {
      ...user.permissions,
      ...permissions
    };

    await user.save();

    res.json({ 
      message: 'Permissions updated successfully', 
      permissions: user.permissions 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all junior admins
exports.getJuniorAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'junior_admin' })
      .select('-password')
      .populate('assignedBy', 'fullName');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle junior admin status
exports.toggleAdminStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'Admin status updated', isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard stats (Super admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const approvedRegistrations = await Registration.countDocuments({ paymentStatus: 'approved' });
    const pendingRegistrations = await Registration.countDocuments({ paymentStatus: 'pending' });
    
    const totalEarnings = await Registration.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    const departmentStats = await Registration.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { _id: '$department', count: { $sum: 1 }, earnings: { $sum: '$amountPaid' } } }
    ]);

    const juniorAdminsCount = await User.countDocuments({ role: 'junior_admin' });
    const studentsCount = await User.countDocuments({ role: 'student' });

    res.json({
      totalRegistrations,
      approvedRegistrations,
      pendingRegistrations,
      totalEarnings: totalEarnings[0]?.total || 0,
      departmentStats,
      juniorAdminsCount,
      studentsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete junior admin
exports.deleteJuniorAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'junior_admin') {
      return res.status(404).json({ message: 'Junior admin not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Junior admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate financial report for download
exports.generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
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
        school: reg.school?.name,
        class: reg.class?.name,
        amount: reg.amountPaid || 30000,
        approvedBy: reg.approvedBy?.fullName
      }))
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};