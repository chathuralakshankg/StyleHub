require('dotenv').config({ path: 'd:/Project/clothingstore/server/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createTestStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // delete if exists
    await User.deleteOne({ email: 'teststaff@example.com' });
    
    const user = await User.create({
      name: 'Test Staff',
      email: 'teststaff@example.com',
      password: 'password123',
      role: 'inventory_handler',
      isVerified: true
    });
    
    console.log('Created test staff:', user.email);
    
    // Test login
    const foundUser = await User.findOne({ email: 'teststaff@example.com' }).select('+password');
    const isMatch = await foundUser.matchPassword('password123');
    
    console.log('Password match?', isMatch);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createTestStaff();
