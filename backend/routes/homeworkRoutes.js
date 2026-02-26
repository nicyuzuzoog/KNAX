const express = require('express');

const router = express.Router();

const Homework = require('../models/Homework');


/*
=========================
GET STUDENT HOMEWORKS
Dynamic
=========================
*/

router.get('/my-homeworks', async (req, res) => {

    try {

        const email = req.query.email;

        if (!email) {

            return res.status(400).json({
                message: "Email required"
            });

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
=========================
CREATE HOMEWORK
Admin
=========================
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
