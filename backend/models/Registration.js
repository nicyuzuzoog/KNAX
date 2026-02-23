// backend/models/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  // Student Information
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  nationalId: {
    type: String,
    trim: true
  },

  // Reference to User model
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // School Information
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  },
  schoolName: {
    type: String,
    trim: true
  },

  // Course/Department
  department: {
    type: String,
    enum: ['Software Development', 'Networking', 'Accounting', 'Electronics'],
    required: [true, 'Department is required']
  },
  educationLevel: {
    type: String,
    trim: true
  },

  // Internship Details
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  
  // FIX: Change the shift enum values to match what's in your database
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'Morning', 'Afternoon', 'Evening'], // Added both cases
    default: 'morning'
  },

  // Documents/Attachments
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'Pending', 'Partial', 'Completed'],
    default: 'pending'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },

  // Review/Approval Information
  reviewNote: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },

  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
RegistrationSchema.index({ status: 1 });
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ createdAt: -1 });
RegistrationSchema.index({ department: 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);