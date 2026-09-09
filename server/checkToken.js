require('dotenv').config({ path: 'd:/Project/clothingstore/server/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const user = await User.findOne({ email: 'realtestreg@example.com' });
    console.log('Verification Token:', user.verificationToken);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
