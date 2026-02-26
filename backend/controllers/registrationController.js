const Registration = require('../models/Registration');


// =============================
// CREATE REGISTRATION
// =============================

exports.createRegistration = async (req, res) => {

  try {

    const {
      department,
      school,
      parentPhone,
      shift
    } = req.body;


    const existing = await Registration.findOne({
      student: req.user.id
    });

    if (existing) {

      return res.status(400).json({
        message: "You already applied"
      });

    }


    const registration = new Registration({

      student: req.user.id,

      studentName: req.user.fullName,

      email: req.user.email,

      phone: req.user.phone,

      department,

      school,

      parentPhone,

      shift

    });


    await registration.save();


    res.status(201).json({

      success: true,

      message: "Application submitted successfully",

      registration

    });

  } catch (error) {

    console.log("Create Registration Error:", error);

    res.status(500).json({

      message: "Server error",

      error: error.message

    });

  }

};



// =============================
// GET MY REGISTRATION
// =============================

exports.getMyRegistration = async (req, res) => {

  try {

    const registration = await Registration.findOne({

      student: req.user.id

    }).populate("school", "name");


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// GET ALL REGISTRATIONS
// =============================

exports.getRegistrations = async (req, res) => {

  try {

    const registrations = await Registration.find()

      .populate("student", "fullName email")

      .populate("school", "name")

      .sort({ createdAt: -1 });


    res.json(registrations);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// GET SINGLE REGISTRATION
// =============================

exports.getRegistration = async (req, res) => {

  try {

    const registration = await Registration.findById(req.params.id)

      .populate("student", "fullName email")

      .populate("school", "name");


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// UPDATE REGISTRATION
// =============================

exports.updateRegistration = async (req, res) => {

  try {

    const registration = await Registration.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// DELETE REGISTRATION
// =============================

exports.deleteRegistration = async (req, res) => {

  try {

    await Registration.findByIdAndDelete(req.params.id);


    res.json({

      message: "Registration deleted"

    });

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// UPDATE PAYMENT STATUS
// =============================

exports.updatePaymentStatus = async (req, res) => {

  try {

    const registration = await Registration.findById(req.params.id);

    registration.paymentStatus = req.body.paymentStatus;

    await registration.save();


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// APPROVE PAYMENT
// =============================

exports.approvePayment = async (req, res) => {

  try {

    const registration = await Registration.findById(req.params.id);

    registration.paymentStatus = "approved";

    registration.status = "approved";

    await registration.save();


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};



// =============================
// REJECT PAYMENT
// =============================

exports.rejectPayment = async (req, res) => {

  try {

    const registration = await Registration.findById(req.params.id);

    registration.paymentStatus = "rejected";

    registration.status = "rejected";

    await registration.save();


    res.json(registration);

  } catch (error) {

    res.status(500).json({

      message: "Server error"

    });

  }

};
