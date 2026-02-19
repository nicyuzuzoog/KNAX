// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main auth middleware - verify token and attach user
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'knax250-secret-key-2024');
    
    // Get user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Attach user to request - THIS IS IMPORTANT!
    req.user = user;
    
    // Debug log
    console.log(`🔐 Auth: ${user.email} (${user.role})`);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Alias for auth
exports.protect = exports.auth;

// Admin only (junior_admin or super_admin)
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  if (req.user.role === 'junior_admin' || req.user.role === 'super_admin') {
    return next();
  }
  
  res.status(403).json({ message: 'Admin access required' });
};

// Super admin only
exports.superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  if (req.user.role === 'super_admin') {
    return next();
  }
  
  res.status(403).json({ message: 'Super Admin access required' });
};

// Junior admin only
exports.juniorAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  if (req.user.role === 'junior_admin' || req.user.role === 'super_admin') {
    return next();
  }
  
  res.status(403).json({ message: 'Admin access required' });
};

// Check specific permission
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user has the specific permission
    if (req.user.permissions && req.user.permissions[permission] === true) {
      return next();
    }

    res.status(403).json({ 
      message: `Permission denied: ${permission} required` 
    });
  };
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role ${req.user.role} is not authorized` 
      });
    }
    
    next();
  };
};