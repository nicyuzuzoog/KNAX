const User = require('../models/User');
const Registration = require('../models/Registration');
const School = require('../models/School');
const bcrypt = require('bcryptjs');


/*
========================
JUNIOR ADMINS
========================
*/

exports.createJuniorAdmin = async (req, res) => {
  try {

    const {
      fullName,
      email,
      password,
      phone
    } = req.body;

    const admin = new User({

      fullName,
      email,
      password,
      phone,

      role: "junior_admin"

    });

    await admin.save();

    res.json({
      message:"Junior admin created",
      admin
    });

  } catch (error) {

    res.status(500).json({
      message:"Server error",
      error:error.message
    });

  }
};


exports.getJuniorAdmins = async (req,res)=>{

try{

const admins = await User.find({
role:"junior_admin"
});

res.json(admins);

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.updateJuniorAdmin = async (req,res)=>{

try{

const admin = await User.findByIdAndUpdate(

req.params.id,
req.body,
{new:true}

);

res.json(admin);

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.deleteJuniorAdmin = async (req,res)=>{

try{

await User.findByIdAndDelete(req.params.id);

res.json({
message:"Admin deleted"
})

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.toggleAdminStatus = async (req,res)=>{

try{

const admin = await User.findById(req.params.id);

admin.isActive = !admin.isActive;

await admin.save();

res.json({
message:"Status updated"
})

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.updateAdminPermissions = async (req,res)=>{

try{

const admin = await User.findById(req.params.id);

admin.permissions=req.body.permissions;

await admin.save();

res.json({
message:"Permissions updated"
})

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.resetAdminPassword = async (req,res)=>{

try{

const password="123456";

const hash=await bcrypt.hash(password,10);

await User.findByIdAndUpdate(

req.params.id,

{password:hash}

);

res.json({
message:"Password reset"
})

}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



/*
========================
DASHBOARD
========================
*/

exports.getDashboardStats = async (req,res)=>{

try{

const totalRegistrations=await Registration.countDocuments();

const approvedRegistrations=await Registration.countDocuments({

status:"approved"

});

const pendingRegistrations=await Registration.countDocuments({

status:"pending"

});


const juniorAdminsCount=await User.countDocuments({

role:"junior_admin"

});


const studentsCount=await User.countDocuments({

role:"student"

});


const schoolsCount=await School.countDocuments();


res.json({

totalEarnings:0,

totalRegistrations,

approvedRegistrations,

pendingRegistrations,

juniorAdminsCount,

studentsCount,

schoolsCount,

departmentStats:[]

});


}catch(error){

res.status(500).json({
message:"Server error",
error:error.message
})

}

};



exports.generateFinancialReport=async(req,res)=>{

res.json({

total:0

});

};



/*
========================
STUDENTS
========================
*/


exports.getAllStudents = async (req,res)=>{

try{

const students=await User.find({

role:"student"

})

.populate("school","name")

.populate("class","name");


res.json(students);


}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

})

}

};



exports.toggleStudentStatus=async(req,res)=>{

try{

const student=await User.findById(req.params.id);

student.isActive=!student.isActive;

await student.save();

res.json({

message:"Student status updated"

});


}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

})

}

};



exports.deleteStudent=async(req,res)=>{

try{

await User.findByIdAndDelete(req.params.id);

res.json({

message:"Student deleted"

});

}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

})

}

};
