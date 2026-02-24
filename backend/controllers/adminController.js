// GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {

  try {

    const { status } = req.query;

    const students = await User.find({
      role: "student"
    })
    .select("-password")
    .sort({ createdAt: -1 });


    const registrations = await Registration.find()
      .populate('school','name')
      .populate('student','fullName email phone');


    const studentsWithStatus = students.map(student => {

      const reg = registrations.find(r =>
        r.student?._id.toString() === student._id.toString()
      );

      return {

        ...student.toObject(),

        hasApplied: !!reg,

        registration: reg || null,

        applicationStatus: reg?.paymentStatus || "not_applied",

        school: reg?.school?.name || null

      };

    });


    let filtered = studentsWithStatus;


    if(status === "applied")
      filtered = studentsWithStatus.filter(s=>s.hasApplied);

    if(status === "not_applied")
      filtered = studentsWithStatus.filter(s=>!s.hasApplied);

    if(status === "approved")
      filtered = studentsWithStatus.filter(s=>s.applicationStatus==="approved");

    if(status === "pending")
      filtered = studentsWithStatus.filter(s=>s.applicationStatus==="pending");


    res.json(filtered);


  } catch (error) {

    console.error("Students error:",error);

    res.status(500).json({
      message:"Server error",
      error:error.message
    });

  }

};
