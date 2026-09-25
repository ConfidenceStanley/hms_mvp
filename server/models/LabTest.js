const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema(
  {
    testId: {
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
    testName: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Haematology', 'Biochemistry', 'Microbiology', 'Parasitology', 'Radiology', 'Urinalysis', 'Other'],
      default: 'Haematology'
    },
    priority: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine'
    },
    status: {
      type: String,
      enum: ['requested', 'processing', 'completed', 'cancelled'],
      default: 'requested'
    },
    results: {
      type: String,
      default: ''
    },
    technicianNotes: {
      type: String,
      default: ''
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LabTest', labTestSchema);