// controllers/registrationController.js

const Registration = require('../models/Registration');


/*
CREATE REGISTRATION
Matches ApplyInternship.jsx
*/

exports.createRegistration = async (req,res)=>{

try{

const registration = await Registration.create({

student:req.user.id,

department:req.body.department,

school:req.body.school,

parentPhone:req.body.parentPhone,

shift:req.body.shift,

paymentStatus:"pending"

});

res.status(201).json(registration);

}catch(error){

console.error(error);

res.status(500).json({
message:"Server error"
})

}

};



/*
GET MY REGISTRATION
*/

exports.getMyRegistration = async (req,res)=>{

try{

const registration = await Registration.findOne({

student:req.user.id

}).populate('school','name');

res.json(registration);

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



/*
GET ALL REGISTRATIONS
*/

exports.getRegistrations = async (req,res)=>{

try{

const registrations = await Registration.find()

.populate('student','fullName email phone age')

.populate('school','name')

.sort({createdAt:-1});

res.json(registrations);

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



/*
GET SINGLE REGISTRATION
*/

exports.getRegistration = async (req,res)=>{

try{

const registration = await Registration.findById(req.params.id)

.populate('student','fullName email phone age')

.populate('school','name');

res.json(registration);

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



/*
UPDATE REGISTRATION
*/

exports.updateRegistration = async (req,res)=>{

try{

const registration = await Registration.findById(req.params.id);

if(!registration){

return res.status(404).json({
message:"Not found"
})

}

await registration.save();

res.json(registration);

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



/*
DELETE REGISTRATION
*/

exports.deleteRegistration = async (req,res)=>{

try{

await Registration.findByIdAndDelete(req.params.id);

res.json({
message:"Deleted"
})

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



/*
UPDATE PAYMENT STATUS
*/

exports.updatePaymentStatus = async (req,res)=>{

try{

const registration = await Registration.findById(req.params.id);

registration.paymentStatus=req.body.status;

await registration.save();

res.json({
message:"Updated"
})

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



exports.approvePayment = async (req,res)=>{

try{

const registration = await Registration.findById(req.params.id);

registration.paymentStatus="approved";

await registration.save();

res.json({
message:"Approved"
})

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};



exports.rejectPayment = async (req,res)=>{

try{

const registration = await Registration.findById(req.params.id);

registration.paymentStatus="rejected";

await registration.save();

res.json({
message:"Rejected"
})

}catch(error){

res.status(500).json({
message:"Server error"
})

}

};
