const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({

  // =========================
  // STUDENT INFORMATION
  // =========================

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  studentName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },


  // =========================
  // SCHOOL
  // =========================

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },


  // =========================
  // DEPARTMENT
  // =========================

  department: {

    type: String,

    enum: [
      "SOD",         // Software Development
      "NIT",         // Networking & IT
      "ACCOUNTING",
      "CSA",         // Computer System Architecture
      "ETE"          // Electronics & Telecom
    ],

    required: true
  },


  // =========================
  // SHIFT
  // =========================

  shift: {

    type: String,

    enum: [
      "morning",
      "afternoon"
    ],

    default: "morning"
  },


  // =========================
  // CONTACT
  // =========================

  parentPhone: {
    type: String,
    required: true
  },


  // =========================
  // PAYMENT
  // =========================

  paymentStatus: {

    type: String,

    enum: [
      "pending",
      "approved",
      "rejected"
    ],

    default: "pending"
  },


  // =========================
  // APPLICATION STATUS
  // =========================

  status: {

    type: String,

    enum: [
      "pending",
      "approved",
      "rejected"
    ],

    default: "pending"
  },


  // =========================
  // RECEIPT
  // =========================

  receiptPhoto: {
    type: String
  }

}, {
  timestamps: true
});


module.exports = mongoose.model('Registration', RegistrationSchema);
