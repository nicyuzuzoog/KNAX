const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');


// ==============================
// MARK ATTENDANCE
// ==============================
exports.markAttendance = async (req, res) => {
  try {
    const { registrationId, status, checkInTime, checkOutTime, notes } = req.body;

    const registration = await Registration.findById(registrationId);

    if (!registration || registration.paymentStatus !== 'approved') {
      return res.status(400).json({
        message: 'Invalid registration or not approved'
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check existing attendance
    const existingAttendance = await Attendance.findOne({
      registration: registrationId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.checkOutTime = checkOutTime;
      existingAttendance.notes = notes;

      await existingAttendance.save();

      return res.json({
        message: 'Attendance updated',
        attendance: existingAttendance
      });
    }

    // Create new attendance
    const attendance = new Attendance({
      registration: registrationId,
      student: registration.student,
      status,
      checkInTime,
      checkOutTime,
      notes,
      markedBy: req.user._id,
      date: new Date() // ✅ Always set date explicitly
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked',
      attendance
    });

  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// ==============================
// GET ATTENDANCE BY REGISTRATION
// ==============================
exports.getAttendanceByRegistration = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      registration: req.params.registrationId
    })
      .populate('markedBy', 'fullName')
      .sort({ date: -1 });

    res.json(attendance);

  } catch (error) {
    console.error("Get by registration error:", error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// ==============================
// GET ATTENDANCE BY DATE (FIXED)
// ==============================
exports.getAttendanceByDate = async (req, res) => {
  try {
    let { date, department } = req.query;

    // ✅ Default to today if no date provided
    let queryDate = date ? new Date(date) : new Date();

    // ✅ Validate date
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date provided'
      });
    }

    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const filter = {
      date: { $gte: queryDate, $lt: nextDay }
    };

    let attendanceRecords = await Attendance.find(filter)
      .populate({
        path: 'registration',
        populate: [
          { path: 'student', select: 'fullName email' },
          { path: 'school', select: 'name' },
          { path: 'class', select: 'name' }
        ]
      })
      .populate('markedBy', 'fullName');

    // ✅ Restrict junior admin to their department
    if (req.user.role === 'junior_admin' && req.user.department) {
      attendanceRecords = attendanceRecords.filter(
        record =>
          record.registration &&
          record.registration.department === req.user.department
      );
    }

    // ✅ Super admin department filter
    if (department && req.user.role === 'super_admin') {
      attendanceRecords = attendanceRecords.filter(
        record =>
          record.registration &&
          record.registration.department === department
      );
    }

    res.json(attendanceRecords);

  } catch (error) {
    console.error("Attendance date error:", error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// ==============================
// GET ACTIVE INTERNS
// ==============================
exports.getActiveInterns = async (req, res) => {
  try {
    const filter = {
      paymentStatus: 'approved',
      internshipStatus: 'active'
    };

    // Restrict junior admins
    if (req.user.role === 'junior_admin' && req.user.department) {
      filter.department = req.user.department;
    }

    const registrations = await Registration.find(filter)
      .populate('student', 'fullName email phone')
      .populate('school', 'name')
      .populate('class', 'name');

    res.json(registrations);

  } catch (error) {
    console.error("Active interns error:", error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// ==============================
// GET MY ATTENDANCE (STUDENT)
// ==============================
exports.getMyAttendance = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      student: req.user._id
    });

    if (!registration) {
      return res.json([]);
    }

    const attendance = await Attendance.find({
      registration: registration._id
    })
      .populate('markedBy', 'fullName')
      .sort({ date: -1 });

    res.json(attendance);

  } catch (error) {
    console.error("My attendance error:", error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
