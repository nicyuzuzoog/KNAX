const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: {
    type: String,
    enum: ['NIT', 'SOD', 'ACCOUNTING', 'CSA', 'ETE'],
    required: true
  },
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, etc.
    required: true
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon'],
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
  subject: {
    type: String,
    required: true
  },
  instructor: {
    type: String
  },
  room: {
    type: String
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Timetable', timetableSchema);