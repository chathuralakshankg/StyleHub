require('dotenv').config({ path: 'd:/Project/clothingstore/server/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const users = await User.find({ role: { $in: ['inventory_handler', 'sales_staff', 'owner'] } }).select('+password');
    console.log(JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
