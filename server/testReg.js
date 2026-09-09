require('dotenv').config({ path: 'd:/Project/clothingstore/server/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const testReg = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // delete if exists
    await User.deleteOne({ email: 'testreg@example.com' });
    
    // simulate registerUser
    const user = await User.create({
      name: 'Test Reg',
      email: 'testreg@example.com',
      password: 'password123'
    });
    
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    console.log('Un-hashed Token (goes to URL):', verificationToken);
    
    const inDb = await User.findById(user._id);
    console.log('Hashed Token in DB:', inDb.verificationToken);
    
    // simulate verifyEmail
    const crypto = require('crypto');
    const hashed = crypto.createHash('sha256').update(verificationToken).digest('hex');
    console.log('Hashed Token calculated from URL:', hashed);
    
    const foundUser = await User.findOne({ verificationToken: hashed });
    console.log('User found during verify?', !!foundUser);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testReg();
