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
    sparse: true,  // Allows null values while still being unique
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
    required: [true, 'Age is required']
  },
  role: {
    type: String,
    enum: ['student', 'junior_admin', 'super_admin'],
    default: 'student'
  },
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE', null],
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate username from email before saving
userSchema.pre('save', async function(next) {
  // Generate username from email if not provided
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0] + '_' + Date.now().toString().slice(-4);
  }
  
  // Hash password
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);