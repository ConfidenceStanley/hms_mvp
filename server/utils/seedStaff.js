const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const staffMembers = [
      {
        name: 'Nurse Adaeze Okafor',
        email: 'adaeze@oronnamedical.com',
        password: 'nurse123',
        role: 'nurse',
        phone: '08055667788',
        gender: 'female'
      },
      {
        name: 'Pharmacist Emeka Nwosu',
        email: 'emeka@oronnamedical.com',
        password: 'pharma123',
        role: 'pharmacist',
        phone: '08066778899',
        gender: 'male'
      },
      {
        name: 'Lab Scientist Bisi Adeyemi',
        email: 'bisi@oronnamedical.com',
        password: 'lab123',
        role: 'lab_technician',
        phone: '08077889900',
        gender: 'female'
      },
      {
        name: 'Receptionist Tolu Bakare',
        email: 'tolu@oronnamedical.com',
        password: 'reception123',
        role: 'receptionist',
        phone: '08088990011',
        gender: 'female'
      },
      {
        name: 'Accountant Yemi Ojo',
        email: 'yemi@oronnamedical.com',
        password: 'account123',
        role: 'accountant',
        phone: '08099001122',
        gender: 'male'
      }
    ];

    for (const staff of staffMembers) {
      const existing = await User.findOne({ email: staff.email });
      if (existing) {
        console.log(`Skipped: ${staff.name} (${staff.email}) already exists`);
        continue;
      }

      await User.create(staff);
      console.log(`Created: ${staff.name} (${staff.role}) - Password: ${staff.password}`);
    }

    console.log('\nStaff seeding complete.');
    console.log('\nAll Login Credentials:');
    console.log('Admin:        admin@hms.com / admin123');
    console.log('Doctors:      adeyemi@oronnamedical.com / doctor123');
    console.log('              folake@oronnamedical.com / doctor123');
    console.log('              chukwuma@oronnamedical.com / doctor123');
    console.log('Nurse:        adaeze@oronnamedical.com / nurse123');
    console.log('Pharmacist:   emeka@oronnamedical.com / pharma123');
    console.log('Lab Tech:     bisi@oronnamedical.com / lab123');
    console.log('Receptionist: tolu@oronnamedical.com / reception123');
    console.log('Accountant:   yemi@oronnamedical.com / account123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedStaff();