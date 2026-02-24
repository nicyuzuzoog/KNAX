// routes/announcementRoutes.js

const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');


/*
=====================
Get ALL announcements
=====================
*/
router.get('/', auth, async (req, res) => {

  try {

    // Example with model:
    // const Announcement = require('../models/Announcement');
    // const announcements = await Announcement.find().sort({createdAt:-1});

    res.json({
      announcements: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

});


/*
==================================
IMPORTANT ROUTE FOR STUDENT PANEL
==================================
*/

router.get('/my-announcements', auth, async (req, res) => {

  try {

    // Example with model:
    // const Announcement = require('../models/Announcement');
    // const announcements = await Announcement.find({
    //   department: req.user.department
    // });

    res.json({
      announcements: []
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error fetching announcements'
    });

  }

});



/*
=====================
Create announcement
=====================
*/
router.post('/', auth, adminOnly, async (req, res) => {

  try {

    const { title, content, priority, department } = req.body;

    res.json({
      message: 'Announcement created',
      announcement: {}
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

});



/*
=====================
Update announcement
=====================
*/
router.put('/:id', auth, adminOnly, async (req, res) => {

  try {

    res.json({
      message: 'Announcement updated'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});



/*
=====================
Delete announcement
=====================
*/
router.delete('/:id', auth, adminOnly, async (req, res) => {

  try {

    res.json({
      message: 'Announcement deleted'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});

module.exports = router;
