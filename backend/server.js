// // server.js
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();
// const connectDB = require('./config/db');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// const allowedOrigins = [process.env.CLIENT_URL];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Ensure upload directories exist
// const dirs = ['uploads', 'uploads/receipts', 'uploads/photos'];
// dirs.forEach(dir => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// // Serve static uploads (ephemeral on Render, consider S3 for persistence)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Request logging with timestamps
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] 📥 ${req.method} ${req.path}`);
//   next();
// });

// // ==========================================
// // ROUTES
// // ==========================================
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/registrations', require('./routes/registrationRoutes'));
// app.use('/api/schools', require('./routes/schoolRoutes'));
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/announcements', require('./routes/announcementRoutes'));

// // Optional routes with fallback
// const optionalRoutes = [
//   { path: '/api/timetable', file: './routes/timetableRoutes', fallback: { timetable: [] } },
//   { path: '/api/shifts', file: './routes/shiftRoutes', fallback: { shifts: [] } },
//   { path: '/api/messages', file: './routes/messageRoutes', fallback: { messages: [] } }
// ];

// optionalRoutes.forEach(r => {
//   try {
//     app.use(r.path, require(r.file));
//   } catch {
//     console.log(`⚠️ Optional route ${r.path} not found, using placeholder`);
//     app.use(r.path, (req, res) => res.json(r.fallback));
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     routes: [
//       '/api/auth',
//       '/api/admin',
//       '/api/registrations',
//       '/api/schools',
//       '/api/attendance',
//       '/api/announcements'
//     ]
//   });
// });

// // Test registration routes
// app.get('/api/test-routes', (req, res) => {
//   res.json({
//     message: 'Available registration routes',
//     routes: [
//       'GET    /api/registrations',
//       'GET    /api/registrations/:id',
//       'POST   /api/registrations',
//       'PUT    /api/registrations/:id',
//       'DELETE /api/registrations/:id',
//       'PATCH  /api/registrations/:id/status',
//       'PATCH  /api/registrations/:id/approve',
//       'PATCH  /api/registrations/:id/reject'
//     ]
//   });
// });

// // Serve React frontend in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
//   });
// }

// // 404 handler
// app.use((req, res) => {
//   console.log(`[${new Date().toISOString()}] ❌ 404: ${req.method} ${req.path}`);
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.path,
//     method: req.method
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
//   res.status(err.status || 500).json({ message: err.message || 'Server error' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log('==========================================');
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 API Health Check: /api/health`);
//   console.log('==========================================');
// });

