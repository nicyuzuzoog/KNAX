const express = require('express');

const router = express.Router();

const Homework = require('../models/Homework');


/*
==================================
GET STUDENT HOMEWORKS (DYNAMIC)
Uses logged in user email
==================================
*/

router.get('/my-homeworks', async (req, res) => {

    try {

        const email = req.headers.email;

        if (!email) {

            return res.json([]);

        }

        const homeworks = await Homework.find({
            studentEmail: email
        }).sort({ createdAt: -1 });

        res.json(homeworks);

    }

    catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


/*
==================================
CREATE HOMEWORK (ADMIN)
==================================
*/

router.post('/create', async (req, res) => {

    try {

        const homework = new Homework(req.body);

        await homework.save();

        res.json({

            message: "Homework created",

            homework

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


module.exports = router;
