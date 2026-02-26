const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const connectDB = require('./config/db');

const app = express();


// ================= DATABASE =================
connectDB();


// ================= CORS =================
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin))
      return callback(null, true);

    callback(new Error("CORS blocked"));

  },
  credentials: true
}));


// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= UPLOAD DIRECTORIES =================
const dirs = [
  'uploads',
  'uploads/receipts',
  'uploads/photos',
  'uploads/homeworks'
];

dirs.forEach(dir => {

  const fullPath = path.join(__dirname, dir);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

});


// ================= STATIC FILES =================
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);


// ================= ROOT =================
app.get('/', (req, res) => {
  res.send("Server running");
});


// ================= ROUTES =================

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/admin',
  require('./routes/adminRoutes')
);

app.use(
  '/api/registrations',
  require('./routes/registrationRoutes')
);

app.use(
  '/api/schools',
  require('./routes/schoolRoutes')
);

app.use(
  '/api/attendance',
  require('./routes/attendanceRoutes')
);

app.use(
  '/api/announcements',
  require('./routes/announcementRoutes')
);


/*
==============================
HOMEWORK ROUTES (NEW)
==============================
*/
app.use(
  '/api/homeworks',
  require('./routes/homeworkRoutes')
);



/*
==============================
HEALTH CHECK
==============================
*/
app.get('/api/health', (req, res) => {

  res.json({
    status: "OK"
  });

});


/*
==============================
404 HANDLER
==============================
*/
app.use((req, res) => {

  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });

});


/*
==============================
START SERVER
==============================
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("Server running on port", PORT);

});
