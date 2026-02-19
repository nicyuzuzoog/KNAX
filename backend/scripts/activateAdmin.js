// backend/scripts/activateAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();

const activateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'adventistelyceedenyanza@gmail.com' },
      { $set: { isActive: true } }
    );

    console.log('✅ Result:', result);
    
    // Verify
    const user = await mongoose.connection.db.collection('users').findOne({
      email: 'adventistelyceedenyanza@gmail.com'
    });
    
    console.log('\n✅ User status:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('isActive:', user.isActive);
    console.log('Department:', user.department);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

activateAdmin();