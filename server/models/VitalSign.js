const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    recorderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required (°C)']
    },
    bloodPressureSystolic: {
      type: Number,
      required: [true, 'Systolic blood pressure is required']
    },
    bloodPressureDiastolic: {
      type: Number,
      required: [true, 'Diastolic blood pressure is required']
    },
    heartRate: {
      type: Number,
      required: [true, 'Heart rate is required (bpm)']
    },
    respiratoryRate: {
      type: Number,
      required: [true, 'Respiratory rate is required (cpm)']
    },
    oxygenSaturation: {
      type: Number,
      required: [true, 'Oxygen saturation SpO2 is required (%)']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required (kg)']
    },
    height: {
      type: Number,
      required: [true, 'Height is required (cm)']
    },
    bmi: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('VitalSign', vitalSignSchema);