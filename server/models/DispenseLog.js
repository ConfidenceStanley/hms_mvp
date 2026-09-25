const mongoose = require('mongoose');

const dispenseLogSchema = new mongoose.Schema(
  {
    dispenseId: {
      type: String,
      required: true,
      unique: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    pharmacistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    medicalRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord'
    },
    items: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine',
          required: true
        },
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        quantityDispensed: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
      }
    ],
    totalBill: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['dispensed', 'cancelled'],
      default: 'dispensed'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DispenseLog', dispenseLogSchema);