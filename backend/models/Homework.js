const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({

title: {
type: String,
required: true
},

description: {
type: String,
required: true
},

department: {

type: String,

enum: [
"SOD",
"NIT",
"ACCOUNTING",
"CSA",
"ETE"
],

required: true

},

shift: {

type: String,

enum: [
"morning",
"afternoon"
],

required: true

},

dueDate: {
type: Date
},

createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
}

},
{
timestamps: true
});


module.exports =
mongoose.model("Homework", HomeworkSchema);
