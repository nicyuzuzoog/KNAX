const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { registrationId, status, checkInTime, checkOutTime, notes } = req.body;

    const registration = await Registration.findById(registrationId);
    if (!registration || registration.paymentStatus !== 'approved') {
      return res.status(400).json({ 
        message: 'Invalid registration or not approved' 
      });
    }

    // Check if attendance already marked for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      registration: registrationId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.checkOutTime = checkOutTime;
      existingAttendance.notes = notes;
      await existingAttendance.save();
      return res.json({ message: 'Attendance updated', attendance: existingAttendance });
    }

    const attendance = new Attendance({
      registration: registrationId,
      student: registration.student,
      status,
      checkInTime,
      checkOutTime,
      notes,
      markedBy: req.user._id
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance by registration
exports.getAttendanceByRegistration = async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      registration: req.params.registrationId 
    })
      .populate('markedBy', 'fullName')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance for a specific date (Admin)
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date, department } = req.query;
    const queryDate = new Date(date);
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

    // Filter by department if junior admin
    if (req.user.role === 'junior_admin' && req.user.department) {
      attendanceRecords = attendanceRecords.filter(
        record => record.registration.department === req.user.department
      );
    }

    if (department && req.user.role === 'super_admin') {
      attendanceRecords = attendanceRecords.filter(
        record => record.registration.department === department
      );
    }

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active interns for attendance marking
exports.getActiveInterns = async (req, res) => {
  try {
    const filter = { 
      paymentStatus: 'approved',
      internshipStatus: 'active'
    };

    // Junior admins can only see their department
    if (req.user.role === 'junior_admin' && req.user.department) {
      filter.department = req.user.department;
    }

    const registrations = await Registration.find(filter)
      .populate('student', 'fullName email phone')
      .populate('school', 'name')
      .populate('class', 'name');

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my attendance (Student)
exports.getMyAttendance = async (req, res) => {
  try {
    const registration = await Registration.findOne({ student: req.user._id });
    if (!registration) {
      return res.json([]);
    }

    const attendance = await Attendance.find({ registration: registration._id })
      .populate('markedBy', 'fullName')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};