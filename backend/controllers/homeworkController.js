const Homework = require('../models/Homework');
const Registration = require('../models/Registration');


// ======================
// CREATE HOMEWORK (ADMIN)
// ======================

exports.createHomework = async (req,res)=>{

try{

const homework =
await Homework.create({

title:req.body.title,

description:req.body.description,

department:req.body.department,

shift:req.body.shift,

dueDate:req.body.dueDate,

createdBy:req.user.id

});

res.json(homework);

}catch(error){

res.status(500).json({

message:"Server error"

});

}

};



// ======================
// GET STUDENT HOMEWORKS
// ======================

exports.getMyHomeworks = async (req,res)=>{

try{


const registration =
await Registration.findOne({

student:req.user.id

});


if(!registration){

return res.json([]);

}


const homeworks =
await Homework.find({

department:registration.department,

shift:registration.shift

}).sort({createdAt:-1});


res.json(homeworks);

}catch(error){

console.log(error);

res.status(500).json({

message:"Server error"

});

}

};



// ======================
// GET ALL HOMEWORKS
// ======================

exports.getHomeworks = async (req,res)=>{

try{

const homeworks =
await Homework.find()

.sort({createdAt:-1});


res.json(homeworks);

}catch(error){

res.status(500).json({

message:"Server error"

});

}

};



// ======================
// DELETE HOMEWORK
// ======================

exports.deleteHomework = async (req,res)=>{

try{

await Homework.findByIdAndDelete(
req.params.id
);

res.json({

message:"Deleted"

});

}catch(error){

res.status(500).json({

message:"Server error"

});

}

};
