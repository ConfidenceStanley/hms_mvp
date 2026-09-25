const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 1
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'insurance', 'hmo'],
      required: true
    },
    transactionReference: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success'
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);