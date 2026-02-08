const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directories
const dirs = ['uploads', 'uploads/receipts', 'uploads/departments', 'uploads/certificates'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Database connection
const connectDB = require('./config/db');
connectDB()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err.message));

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Try to load timetable routes
let timetableRoutes;
try {
  timetableRoutes = require('./routes/timetableRoutes');
} catch (e) {
  console.log('Timetable routes not configured');
}

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);

if (timetableRoutes) {
  app.use('/api/timetable', timetableRoutes);
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'KNAX_250 TECHNOLOGY Ltd API is running!', 
    status: 'OK',
    timestamp: new Date()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 KNAX_250 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📧 Email: nicjbdede@gmail.com`);
});