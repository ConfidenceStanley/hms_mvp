const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LabTest = require('../models/LabTest');

dotenv.config();

const deleteAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await LabTest.deleteMany({});
    console.log(`Deleted ${result.deletedCount} lab test records.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

deleteAll();