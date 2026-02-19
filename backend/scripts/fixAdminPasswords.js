// scripts/fixAdminPasswords.js
// Run: node scripts/fixAdminPasswords.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knax250';

async function fixPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String,
      password: String,
      phone: String,
      role: String,
      department: String,
      isActive: Boolean
    }));

    // Find all junior admins
    const admins = await User.find({ role: 'junior_admin' });
    
    if (admins.length === 0) {
      console.log('No junior admins found in database.');
      process.exit(0);
    }

    console.log(`Found ${admins.length} junior admin(s):\n`);

    for (const admin of admins) {
      console.log(`📧 Email: ${admin.email}`);
      console.log(`   Name: ${admin.fullName}`);
      console.log(`   Department: ${admin.department}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Password hash: ${admin.password?.substring(0, 20)}...`);
      console.log('');
    }

    // Ask to reset password
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter email to reset password (or "exit" to quit): ', async (email) => {
      if (email.toLowerCase() === 'exit') {
        await mongoose.disconnect();
        process.exit(0);
      }

      const admin = await User.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        console.log('❌ Admin not found');
        await mongoose.disconnect();
        process.exit(1);
      }

      rl.question('Enter new password (min 6 chars): ', async (newPassword) => {
        if (newPassword.length < 6) {
          console.log('❌ Password must be at least 6 characters');
          await mongoose.disconnect();
          process.exit(1);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update directly in database
        await User.updateOne(
          { _id: admin._id },
          { $set: { password: hashedPassword } }
        );

        console.log('\n✅ Password reset successfully!');
        console.log(`   Email: ${admin.email}`);
        console.log(`   New Password: ${newPassword}`);
        console.log('\nYou can now login with these credentials.');
        
        await mongoose.disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPasswords();