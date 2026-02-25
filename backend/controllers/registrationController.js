const Registration =
require('../models/Registration');


/*
CREATE REGISTRATION
*/

exports.createRegistration = async (req,res)=>{

try{

const registration =
new Registration({

student:req.user.id,

department:req.body.department,

school:req.body.school,

parentPhone:req.body.parentPhone,

shift:req.body.shift,

status:"pending"

});

await registration.save();

res.json({

message:"Application submitted",

registration

});

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
MY REGISTRATION
*/

exports.getMyRegistration =
async(req,res)=>{

try{

const registration =
await Registration.findOne({

student:req.user.id

})
.populate("school","name");


res.json(registration);

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
GET ALL
*/

exports.getRegistrations =
async(req,res)=>{

try{

const registrations =
await Registration.find()

.populate("student","fullName email")

.populate("school","name")

.sort({createdAt:-1});


res.json(registrations);

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
GET ONE
*/

exports.getRegistration =
async(req,res)=>{

try{

const registration =
await Registration.findById(req.params.id)

.populate("student")

.populate("school");


res.json(registration);

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
UPDATE
*/

exports.updateRegistration =
async(req,res)=>{

try{

const registration =
await Registration.findByIdAndUpdate(

req.params.id,

req.body,

{new:true}

);

res.json(registration);

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
DELETE
*/

exports.deleteRegistration =
async(req,res)=>{

try{

await Registration.findByIdAndDelete(
req.params.id
);

res.json({

message:"Deleted"

});

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



/*
STATUS UPDATE
*/

exports.updatePaymentStatus =
async(req,res)=>{

try{

const registration =
await Registration.findById(
req.params.id
);

registration.status =
req.body.status;

await registration.save();

res.json({

message:"Status updated"

});

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



exports.approvePayment =
async(req,res)=>{

try{

const registration =
await Registration.findById(
req.params.id
);

registration.status="approved";

await registration.save();

res.json({

message:"Approved"

});

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};



exports.rejectPayment =
async(req,res)=>{

try{

const registration =
await Registration.findById(
req.params.id
);

registration.status="rejected";

await registration.save();

res.json({

message:"Rejected"

});

}catch(error){

res.status(500).json({

message:"Server error",

error:error.message

});

}

};
