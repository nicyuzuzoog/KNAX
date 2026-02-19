// backend/controllers/announcementController.js
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Registration = require('../models/Registration');

// Import email service safely
let emailService;
try {
  emailService = require('../services/emailService');
} catch (e) {
  console.log('⚠️ Email service not available');
  emailService = null;
}

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, targetAudience, department, expiresAt, sendEmail } = req.body;

    const announcement = new Announcement({
      title,
      content,
      type: type || 'general',
      targetAudience: targetAudience || 'all',
      department: targetAudience === 'department' ? department : null,
      expiresAt: expiresAt || null,
      createdBy: req.user._id,
      isActive: true
    });

    await announcement.save();
    console.log('✅ Announcement created:', title);

    // Send emails if requested
    let emailResult = { success: 0, failed: 0 };
    
    if (sendEmail !== false && emailService?.sendAnnouncementEmail) {
      let recipients = [];

      if (targetAudience === 'all') {
        recipients = await User.find({ isActive: true }).select('email fullName');
      } else if (targetAudience === 'students') {
        recipients = await User.find({ role: 'student', isActive: true }).select('email fullName');
      } else if (targetAudience === 'admins') {
        recipients = await User.find({ 
          role: { $in: ['junior_admin', 'super_admin'] }, 
          isActive: true 
        }).select('email fullName');
      } else if (targetAudience === 'department' && department) {
        const registrations = await Registration.find({ 
          department: department,
          paymentStatus: 'approved'
        }).populate('student', 'email fullName');
        
        recipients = registrations
          .filter(r => r.student?.email)
          .map(r => ({ email: r.student.email, fullName: r.student.fullName }));

        const deptAdmins = await User.find({ 
          role: 'junior_admin', 
          department: department,
          isActive: true 
        }).select('email fullName');
        
        recipients = [...recipients, ...deptAdmins];
      }

      // Remove duplicates
      const uniqueRecipients = recipients.filter((r, i, self) =>
        i === self.findIndex(t => t.email === r.email)
      );

      if (uniqueRecipients.length > 0) {
        emailResult = await emailService.sendAnnouncementEmail(uniqueRecipients, announcement);
      }
    }

    res.status(201).json({
      message: 'Announcement created successfully!',
      announcement,
      emailsSent: emailResult.success,
      emailsFailed: emailResult.failed
    });
  } catch (error) {
    console.error('❌ Create announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get announcements for current user
exports.getMyAnnouncements = async (req, res) => {
  try {
    const user = req.user;
    
    const query = {
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: user.role === 'student' ? 'students' : 'admins' }
      ]
    };

    if (user.department) {
      query.$or.push({ targetAudience: 'department', department: user.department });
    }

    if (user.role === 'student') {
      const registration = await Registration.findOne({ student: user._id });
      if (registration?.department) {
        query.$or.push({ targetAudience: 'department', department: registration.department });
      }
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    const unreadCount = announcements.filter(a => 
      !a.readBy?.some(r => r.user?.toString() === user._id.toString())
    ).length;

    res.json({ announcements, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark announcement as read
exports.markAsRead = async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: { user: req.user._id, readAt: new Date() } }
    });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement updated', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};