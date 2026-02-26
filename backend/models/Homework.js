const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    subject: {
        type: String,
        default: "General"
    },

    studentEmail: {
        type: String,
        required: true
    },

    dueDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ['pending','submitted','graded'],
        default: 'pending'
    },

    fileUrl: {
        type: String
    }

},{
    timestamps:true
});

module.exports = mongoose.model('Homework', HomeworkSchema);
