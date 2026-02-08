const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// User Schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create Super Admin
const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log('Super Admin already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create super admin
    const superAdmin = new User({
      fullName: 'Super Admin',
      email: 'admin@internhub.rw',
      password: hashedPassword,
      role: 'super_admin',
      phone: '0780000000'
    });

    await superAdmin.save();
    
    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email: admin@internhub.rw');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();