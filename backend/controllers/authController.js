// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Import email service - wrapped in try-catch to prevent crashes
let emailService;
try {
  emailService = require('../services/emailService');
  console.log('✅ Email service loaded');
} catch (e) {
  console.log('⚠️ Email service not available:', e.message);
  emailService = null;
}

// Generate JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'knax250-fallback-secret';
  console.log('🔑 Using JWT secret:', secret.substring(0, 5) + '...');
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    console.log('========================================');
    console.log('📝 REGISTRATION REQUEST RECEIVED');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('========================================');

    const { fullName, email, password, phone, age } = req.body;

    // Validate required fields
    const missing = [];
    if (!fullName || !fullName.trim()) missing.push('fullName');
    if (!email || !email.trim()) missing.push('email');
    if (!password) missing.push('password');
    if (!phone || !phone.trim()) missing.push('phone');
    if (age === undefined || age === null || age === '') missing.push('age');

    if (missing.length > 0) {
      console.log('❌ Missing fields:', missing);
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}`,
        missing,
        received: Object.keys(req.body)
      });
    }

    // Validate and convert age
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      console.log('❌ Invalid age:', age);
      return res.status(400).json({ message: 'Age must be a valid number' });
    }

    if (ageNum < 16 || ageNum > 100) {
      console.log('❌ Age out of range:', ageNum);
      return res.status(400).json({ message: 'Age must be between 16 and 100' });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by the model
      phone: phone.trim(),
      age: ageNum
    });

    await user.save();
    console.log('✅ User created successfully:', user.email);

    // Send welcome email (don't block registration if email fails)
    let emailSent = false;
    if (emailService && emailService.sendWelcomeEmail) {
      try {
        emailSent = await emailService.sendWelcomeEmail(user);
        console.log(emailSent ? '✅ Welcome email sent' : '⚠️ Welcome email not sent');
      } catch (emailError) {
        console.error('❌ Email error:', emailError.message);
        // Continue - don't fail registration because of email
      }
    } else {
      console.log('⚠️ Email service not available - skipping welcome email');
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ REGISTRATION COMPLETE');
    console.log('========================================');

    res.status(201).json({
      message: emailSent 
        ? 'Registration successful! Check your email for confirmation.' 
        : 'Registration successful! Welcome to KNAX250!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role || 'student'
      }
    });
  } catch (error) {
    console.error('❌ REGISTRATION ERROR:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `This ${field} is already registered. Please use a different ${field}.` 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ 
      message: 'Server error during registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    console.log('========================================');
    console.log('🔐 LOGIN REQUEST RECEIVED');
    console.log('Email:', req.body.email);
    console.log('========================================');

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ Account deactivated:', email);
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ LOGIN SUCCESSFUL');
    console.log('User:', user.email, '| Role:', user.role);
    console.log('========================================');

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role || 'student',
        department: user.department
      }
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({ 
      message: 'Server error during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role || 'student',
        department: user.department
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, age } = req.body;

    const updates = {};
    if (fullName) updates.fullName = fullName.trim();
    if (phone) updates.phone = phone.trim();
    if (age) updates.age = parseInt(age);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};