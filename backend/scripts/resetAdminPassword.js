// backend/scripts/resetAdminPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// USE YOUR ACTUAL MONGODB ATLAS URI
const MONGO_URI = 'mongodb+srv://your_username:your_password@ac-erxvsab.ccvlvbc.mongodb.net/test?retryWrites=true&w=majority';

// OR use this format if you have the full connection string in .env
// require('dotenv').config({ path: '../.env' });
// const MONGO_URI = process.env.MONGO_URI;

const resetPassword = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // First, let's see all users in the database
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('\n📋 All users in database:');
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`);
    });

    if (users.length === 0) {
      console.log('   No users found in database');
      
      // Create a super admin if none exists
      console.log('\n🔄 Creating super admin account...');
      
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      
      await mongoose.connection.db.collection('users').insertOne({
        fullName: 'Super Admin',
        email: 'admin@knax250.rw',
        password: hashedPassword,
        phone: '0782562906',
        age: 30,
        role: 'super_admin',
        department: null,
        isActive: true,
        permissions: {},
        createdAt: new Date()
      });
      
      console.log('\n========================================');
      console.log('✅ SUPER ADMIN CREATED!');
      console.log('========================================');
      console.log('📧 Email: admin@knax250.rw');
      console.log('🔑 Password: Admin@123');
      console.log('========================================\n');
    } else {
      // Reset password for a specific user or the first admin
      const adminEmail = users.find(u => u.role === 'super_admin')?.email || users[0].email;
      const newPassword = 'Admin@123';

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const result = await mongoose.connection.db.collection('users').updateOne(
        { email: adminEmail },
        { $set: { password: hashedPassword, isActive: true } }
      );

      console.log('\n========================================');
      console.log('✅ PASSWORD RESET SUCCESSFUL!');
      console.log('========================================');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', newPassword);
      console.log('========================================\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetPassword();