// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getInbox,
  getSentMessages,
  replyMessage,
  markAsRead,
  getMessageThread,
  deleteMessage
} = require('../controllers/messageController');
const { auth, adminOnly } = require('../middleware/auth');

router.use(auth);

// Common routes
router.post('/', sendMessage);
router.get('/sent', getSentMessages);
router.get('/:id', getMessageThread);
router.patch('/:id/read', markAsRead);

// Admin routes
router.get('/inbox/all', adminOnly, getInbox);
router.post('/:id/reply', adminOnly, replyMessage);
router.delete('/:id', adminOnly, deleteMessage);

module.exports = router;