const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@hms.com' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@hms.com',
      password: 'admin123',
      role: 'admin',
      phone: '08012345678',
      gender: 'male',
      status: 'active'
    });

    console.log('Admin user created successfully');
    console.log(`Email: admin@hms.com`);
    console.log(`Password: admin123`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();