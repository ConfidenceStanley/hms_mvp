const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Patient full name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Home address is required'],
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'other'],
      default: 'single'
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        trim: true
      },
      relationship: {
        type: String,
        required: [true, 'Relationship is required'],
        trim: true
      }
    },
    medicalHistory: {
      type: [String],
      default: []
    },
    allergies: {
      type: [String],
      default: []
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

patientSchema.index({ fullName: 'text', phone: 'text', patientId: 'text' });

module.exports = mongoose.model('Patient', patientSchema);