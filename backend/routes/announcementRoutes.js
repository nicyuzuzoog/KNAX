const express = require('express');
const router = express.Router();

const { auth, adminOnly } = require('../middleware/auth');

const {
  createAnnouncement,
  getAllAnnouncements,
  getMyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead
} = require('../controllers/announcementController');

// Get all announcements
router.get('/', auth, getAllAnnouncements);

// Get my announcements
router.get('/my-announcements', auth, getMyAnnouncements);

// Mark as read
router.patch('/:id/read', auth, markAsRead);

// Create
router.post('/', auth, adminOnly, createAnnouncement);

// Update
router.put('/:id', auth, adminOnly, updateAnnouncement);

// Delete
router.delete('/:id', auth, adminOnly, deleteAnnouncement);

module.exports = router;
