const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Brand or trade name is required'],
      trim: true
    },
    genericName: {
      type: String,
      required: [true, 'Generic pharmaceutical name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Antibiotics',
        'Analgesics / Pain Relief',
        'Antimalarials',
        'Antihypertensives',
        'Antidiabetics',
        'Antihistamines',
        'Vitamins & Supplements',
        'Intravenous Fluids',
        'Topical / Dermatological',
        'Other'
      ],
      required: true
    },
    dosageForm: {
      type: String,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection', 'Infusion', 'Ointment', 'Drops', 'Inhaler'],
      default: 'Tablet'
    },
    strength: {
      type: String,
      required: [true, 'Strength is required (e.g. 500mg, 100ml)'],
      trim: true
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit selling price is required in NGN'],
      min: 0
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Current stock quantity is required'],
      min: 0,
      default: 0
    },
    reorderLevel: {
      type: Number,
      default: 20,
      min: 1
    },
    expiryDate: {
      type: Date,
      required: [true, 'Batch expiry date is required']
    },
    batchNumber: {
      type: String,
      required: [true, 'Manufacturer batch number is required'],
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true,
      default: 'General Pharma Nigeria'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

medicineSchema.index({ name: 'text', genericName: 'text', itemCode: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);