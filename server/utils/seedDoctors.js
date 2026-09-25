const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

dotenv.config();

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Doctor.countDocuments();
    if (existing > 0) {
      console.log(`${existing} doctor(s) already exist. Skipping seed.`);
      process.exit(0);
    }

    const doctorUsers = [
      { name: 'Dr. Adeyemi Ogunleye', email: 'adeyemi@oronnamedical.com', specialization: 'General Medicine', experience: 12, fee: 5000 },
      { name: 'Dr. Folake Adekunle', email: 'folake@oronnamedical.com', specialization: 'Pediatrics', experience: 8, fee: 7000 },
      { name: 'Dr. Chukwuma Obi', email: 'chukwuma@oronnamedical.com', specialization: 'Obstetrics and Gynaecology', experience: 15, fee: 10000 }
    ];

    for (let i = 0; i < doctorUsers.length; i++) {
      const d = doctorUsers[i];

      const user = await User.create({
        name: d.name,
        email: d.email,
        password: 'doctor123',
        role: 'doctor',
        phone: `080${String(10000000 + i * 1111111).slice(0, 8)}`,
        gender: i === 1 ? 'female' : 'male',
        status: 'active'
      });

      await Doctor.create({
        userId: user._id,
        employeeId: `OMC-DR-${String(i + 1).padStart(4, '0')}`,
        specialization: d.specialization,
        qualifications: ['MBBS', 'FMCP'],
        experience: d.experience,
        consultationFee: d.fee,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' }
        ],
        bio: `Experienced ${d.specialization.toLowerCase()} specialist with ${d.experience} years of clinical practice.`
      });

      console.log(`Created: ${d.name} (${d.specialization})`);
    }

    console.log('Doctor seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedDoctors();