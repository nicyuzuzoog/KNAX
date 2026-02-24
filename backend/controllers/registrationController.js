// controllers/registrationController.js

const Registration = require('../models/Registration');


// GET ALL REGISTRATIONS
exports.getRegistrations = async (req, res) => {
  try {

    const registrations = await Registration.find()
      .populate('student', 'fullName email phone age')
      .populate('school', 'name')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });

  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// GET SINGLE REGISTRATION
exports.getRegistration = async (req, res) => {
  try {

    const registration = await Registration.findById(req.params.id)
      .populate('student', 'fullName email phone age')
      .populate('school', 'name')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName');

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    res.json(registration);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
