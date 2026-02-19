// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  age: {
    type: Number,
    required: function() {
      return this.role === 'student';
    },
    min: [16, 'Age must be at least 16'],
    max: [100, 'Age must be less than 100']
  },
  role: {
    type: String,
    enum: ['student', 'junior_admin', 'super_admin'],
    default: 'student'
  },
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE', null, ''],
    default: null
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  permissions: {
    canApprovePayments: { type: Boolean, default: true },
    canRejectPayments: { type: Boolean, default: true },
    canViewRegistrations: { type: Boolean, default: true },
    canManageAttendance: { type: Boolean, default: true },
    canManageTimetable: { type: Boolean, default: true },
    canManageShifts: { type: Boolean, default: true },
    canPostAnnouncements: { type: Boolean, default: true },
    canViewFinancials: { type: Boolean, default: false },
    canUploadReceipts: { type: Boolean, default: true },
    canCreateSchoolRegister: { type: Boolean, default: true }
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate username from email before saving
userSchema.pre('save', async function(next) {
  // Generate username if not exists
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0] + '_' + Date.now().toString().slice(-4);
  }
  
  // Only hash password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    console.log('🔐 Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔑 Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);