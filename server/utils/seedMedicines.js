const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');

dotenv.config();

const seedMedicines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Medicine.countDocuments();
    if (count > 0) {
      console.log(`${count} medicines already exist. Skipping seed.`);
      process.exit(0);
    }

    const sampleMedicines = [
      {
        itemCode: 'OMC-MED-00001',
        name: 'Coartem (Artemether/Lumefantrine)',
        genericName: 'Artemether + Lumefantrine',
        category: 'Antimalarials',
        dosageForm: 'Tablet',
        strength: '20/120mg',
        unitPrice: 2500,
        quantityInStock: 150,
        reorderLevel: 30,
        expiryDate: new Date('2026-12-31'),
        batchNumber: 'CRT-2024-88',
        manufacturer: 'Novartis Pharma'
      },
      {
        itemCode: 'OMC-MED-00002',
        name: 'Amoxil (Amoxicillin)',
        genericName: 'Amoxicillin Trihydrate',
        category: 'Antibiotics',
        dosageForm: 'Capsule',
        strength: '500mg',
        unitPrice: 1800,
        quantityInStock: 200,
        reorderLevel: 40,
        expiryDate: new Date('2026-08-15'),
        batchNumber: 'AMX-9941',
        manufacturer: 'GlaxoSmithKline'
      },
      {
        itemCode: 'OMC-MED-00003',
        name: 'Panadol Extra',
        genericName: 'Paracetamol + Caffeine',
        category: 'Analgesics / Pain Relief',
        dosageForm: 'Tablet',
        strength: '500mg/65mg',
        unitPrice: 500,
        quantityInStock: 500,
        reorderLevel: 50,
        expiryDate: new Date('2027-05-20'),
        batchNumber: 'PND-1044',
        manufacturer: 'GSK Consumer Nigeria'
      },
      {
        itemCode: 'OMC-MED-00004',
        name: 'Augmentin',
        genericName: 'Amoxicillin + Clavulanic Acid',
        category: 'Antibiotics',
        dosageForm: 'Tablet',
        strength: '625mg',
        unitPrice: 6500,
        quantityInStock: 45,
        reorderLevel: 20,
        expiryDate: new Date('2026-04-10'),
        batchNumber: 'AUG-4819',
        manufacturer: 'GSK Pharma'
      },
      {
        itemCode: 'OMC-MED-00005',
        name: 'Lonart Forte',
        genericName: 'Artemether + Lumefantrine',
        category: 'Antimalarials',
        dosageForm: 'Tablet',
        strength: '80/480mg',
        unitPrice: 3200,
        quantityInStock: 120,
        reorderLevel: 25,
        expiryDate: new Date('2026-11-30'),
        batchNumber: 'LNT-2024-02',
        manufacturer: 'Bliss GVS Pharma'
      },
      {
        itemCode: 'OMC-MED-00006',
        name: 'Ciprofloxacin',
        genericName: 'Ciprofloxacin Hydrochloride',
        category: 'Antibiotics',
        dosageForm: 'Tablet',
        strength: '500mg',
        unitPrice: 1200,
        quantityInStock: 80,
        reorderLevel: 20,
        expiryDate: new Date('2026-09-18'),
        batchNumber: 'CPR-7782',
        manufacturer: 'Emzor Pharmaceuticals'
      },
      {
        itemCode: 'OMC-MED-00007',
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        category: 'Antihypertensives',
        dosageForm: 'Tablet',
        strength: '10mg',
        unitPrice: 1500,
        quantityInStock: 10,
        reorderLevel: 25,
        expiryDate: new Date('2025-10-15'),
        batchNumber: 'AML-0091',
        manufacturer: 'Pfizer Nigeria'
      },
      {
        itemCode: 'OMC-MED-00008',
        name: 'Normal Saline (0.9% NaCl)',
        genericName: 'Sodium Chloride IV Infusion',
        category: 'Intravenous Fluids',
        dosageForm: 'Infusion',
        strength: '500ml',
        unitPrice: 1000,
        quantityInStock: 85,
        reorderLevel: 30,
        expiryDate: new Date('2027-01-01'),
        batchNumber: 'NS-500-24',
        manufacturer: 'Unique Pharma Ilaro'
      }
    ];

    await Medicine.insertMany(sampleMedicines);
    console.log(`Seeded ${sampleMedicines.length} pharmacy medicines successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding medicines:', error.message);
    process.exit(1);
  }
};

seedMedicines();