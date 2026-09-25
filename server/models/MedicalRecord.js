const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    chiefComplaint: {
      type: String,
      required: [true, 'Chief complaint is required'],
      trim: true
    },
    clinicalNotes: {
      type: String,
      required: [true, 'Clinical notes and examination findings are required'],
      trim: true
    },
    diagnosis: {
      type: [String],
      required: [true, 'At least one diagnosis is required']
    },
    prescription: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String, default: '' }
      }
    ],
    treatmentPlan: {
      type: String,
      default: ''
    },
    linkedVitals: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VitalSign'
    },
    linkedLabTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);