const express = require('express');
const router = express.Router();
const {
  generateInvoice,
  getAllInvoices,
  getInvoiceById,
  recordPayment,
  getInvoiceStats,
  getPaymentHistory
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'accountant', 'receptionist'), generateInvoice);
router.get('/', protect, authorize('admin', 'accountant', 'receptionist', 'patient'), getAllInvoices);
router.get('/stats', protect, authorize('admin', 'accountant'), getInvoiceStats);
router.get('/payments', protect, authorize('admin', 'accountant'), getPaymentHistory);
router.get('/:id', protect, getInvoiceById);
router.post('/:id/pay', protect, authorize('admin', 'accountant'), recordPayment);

module.exports = router;