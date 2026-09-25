const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    timeSlot: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ['booked', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'booked'
    },
    reason: {
      type: String,
      trim: true,
      default: 'General Consultation'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cancelledReason: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ patientId: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);