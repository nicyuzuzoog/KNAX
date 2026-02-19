// models/Shift.js
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shift name is required'],
    enum: ['morning', 'afternoon', 'evening'],
    trim: true
  },
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  maxCapacity: {
    type: Number,
    default: 30
  },
  currentEnrollment: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index
shiftSchema.index({ department: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Shift', shiftSchema);