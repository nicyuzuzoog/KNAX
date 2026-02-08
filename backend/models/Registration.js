// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'],
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  // New fields
  parentPhone: {
    type: String,
    required: [true, 'Parent/Guardian phone number is required'],
    trim: true
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon'],
    required: [true, 'Shift selection is required']
  },
  receiptPhoto: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 30000
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  internshipStatus: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Attendance summary (updated by attendance system)
  attendanceSummary: {
    totalDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    lateDays: { type: Number, default: 0 },
    excusedDays: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
registrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for calculating internship duration
registrationSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual for remaining days
registrationSchema.virtual('remainingDays').get(function() {
  if (this.endDate && this.internshipStatus === 'active') {
    const now = new Date();
    const diffTime = this.endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  return 0;
});

// Ensure virtuals are included in JSON
registrationSchema.set('toJSON', { virtuals: true });
registrationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Registration', registrationSchema);