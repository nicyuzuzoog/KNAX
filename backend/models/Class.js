// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  // Optional: Which department this class primarily belongs to
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE', null],
    default: null
  },
  level: {
    type: String,
    enum: ['L3', 'L4', 'L5', 'L6', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Other'],
    default: 'Other'
  },
  studentsCount: {
    type: Number,
    default: 0
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

// Compound unique index - same class name can't exist twice in same school
classSchema.index({ name: 1, school: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);