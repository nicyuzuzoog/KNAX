const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    studentEmail: {
        type: String,
        required: true
    },

    dueDate: {
        type: Date
    },

    fileUrl: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Homework', HomeworkSchema);
