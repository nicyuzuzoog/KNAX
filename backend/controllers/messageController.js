// controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');

// Send message (student to admin)
exports.sendMessage = async (req, res) => {
  try {
    const { subject, content, type, recipientId } = req.body;

    const message = new Message({
      sender: req.user._id,
      recipient: recipientId || null, // null means general admin inbox
      subject,
      content,
      type: type || 'inquiry'
    });

    await message.save();
    await message.populate('sender', 'fullName email role');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get inbox (for admins)
exports.getInbox = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {
      $or: [
        { recipient: req.user._id },
        { recipient: null } // General admin messages
      ],
      parentMessage: null // Only top-level messages
    };

    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .populate('sender', 'fullName email role department')
      .populate('replies')
      .sort({ createdAt: -1 });

    const unreadCount = await Message.countDocuments({
      ...filter,
      status: 'unread'
    });

    res.json({ messages, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sent messages (for students)
exports.getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      sender: req.user._id,
      parentMessage: null
    })
      .populate('replies')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reply to message
exports.replyMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const parentMessage = await Message.findById(req.params.id);

    if (!parentMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const reply = new Message({
      sender: req.user._id,
      recipient: parentMessage.sender,
      subject: `Re: ${parentMessage.subject}`,
      content,
      type: 'reply',
      parentMessage: parentMessage._id
    });

    await reply.save();

    // Update parent message
    parentMessage.status = 'replied';
    parentMessage.replies.push(reply._id);
    await parentMessage.save();

    await reply.populate('sender', 'fullName email role');

    res.status(201).json({
      message: 'Reply sent successfully',
      data: reply
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: 'read',
        readAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get message with replies
exports.getMessageThread = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'fullName email role department')
      .populate({
        path: 'replies',
        populate: {
          path: 'sender',
          select: 'fullName email role'
        }
      });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read if recipient is viewing
    if (message.status === 'unread' && 
        (message.recipient?.toString() === req.user._id.toString() || 
         (message.recipient === null && req.user.role !== 'student'))) {
      message.status = 'read';
      message.readAt = new Date();
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.status = 'archived';
    await message.save();

    res.json({ message: 'Message archived' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};