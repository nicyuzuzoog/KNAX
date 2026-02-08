const Timetable = require('../models/Timetable');

// Get timetable for a department
exports.getTimetable = async (req, res) => {
  try {
    const { department, day } = req.query;
    const filter = { isActive: true };
    
    if (department) filter.department = department;
    if (day !== undefined) filter.dayOfWeek = parseInt(day);

    const timetable = await Timetable.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add timetable entry (Admin)
exports.addTimetable = async (req, res) => {
  try {
    const entry = new Timetable(req.body);
    await entry.save();
    res.status(201).json({ message: 'Timetable entry added', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Timetable updated', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete timetable
exports.deleteTimetable = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timetable entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};