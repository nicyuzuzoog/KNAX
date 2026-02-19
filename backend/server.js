// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const dirs = ['uploads', 'uploads/receipts', 'uploads/photos'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Optional routes - only include if they exist
try {
  app.use('/api/timetable', require('./routes/timetableRoutes'));
} catch (e) {
  console.log('⚠️ Timetable routes not found, using placeholder');
  app.use('/api/timetable', (req, res) => res.json({ timetable: [] }));
}

try {
  app.use('/api/shifts', require('./routes/shiftRoutes'));
} catch (e) {
  console.log('⚠️ Shift routes not found, using placeholder');
  app.use('/api/shifts', (req, res) => res.json({ shifts: [] }));
}

try {
  app.use('/api/messages', require('./routes/messageRoutes'));
} catch (e) {
  app.use('/api/messages', (req, res) => res.json({ messages: [] }));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth',
      '/api/admin',
      '/api/registrations',
      '/api/schools',
      '/api/attendance',
      '/api/announcements'
    ]
  });
});

// Test registration routes
app.get('/api/test-routes', (req, res) => {
  res.json({
    message: 'Available registration routes',
    routes: [
      'GET    /api/registrations',
      'GET    /api/registrations/:id',
      'POST   /api/registrations',
      'PUT    /api/registrations/:id',
      'DELETE /api/registrations/:id',
      'PATCH  /api/registrations/:id/status    <-- Use this!',
      'PATCH  /api/registrations/:id/approve',
      'PATCH  /api/registrations/:id/reject'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🔧 Test: http://localhost:${PORT}/api/test-routes`);
  console.log('==========================================');
});