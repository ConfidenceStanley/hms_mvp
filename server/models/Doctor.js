const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    department: {
      type: String,
      trim: true,
      default: 'General'
    },
    qualifications: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    profileImage: {
      type: String,
      default: ''
    },
    availableDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    availableSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    bio: {
      type: String,
      trim: true,
      default: ''
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

module.exports = mongoose.model('Doctor', doctorSchema);