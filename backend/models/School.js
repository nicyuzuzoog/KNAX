// models/School.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
    unique: true,
    trim: true
  },
  // Departments/Courses offered by this school
  departments: [{
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE']
  }],
  location: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  province: {
    type: String,
    enum: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'],
    default: 'Kigali'
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  principalName: {
    type: String,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Stats
  studentsCount: {
    type: Number,
    default: 0
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

// Update timestamp before saving
schoolSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for classes
schoolSchema.virtual('classes', {
  ref: 'Class',
  localField: '_id',
  foreignField: 'school'
});

// Ensure virtuals are included
schoolSchema.set('toJSON', { virtuals: true });
schoolSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('School', schoolSchema);