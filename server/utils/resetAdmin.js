const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Remove old admin if broken
    await User.deleteOne({ email: 'admin@hms.com' });

    // Create fresh admin user with proper password hashing
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@hms.com',
      password: 'admin123',
      role: 'admin',
      phone: '08012345678',
      gender: 'male',
      status: 'active'
    });

    console.log('Admin account created successfully in Atlas!');
    console.log('Email:    admin@hms.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();