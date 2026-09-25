const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getPendingPrescriptions,
  dispensePrescription,
  getDispenseHistory
} = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'pharmacist'), addMedicine);
router.get('/', protect, getAllMedicines);
router.get('/prescriptions/pending', protect, authorize('admin', 'pharmacist'), getPendingPrescriptions);
router.post('/dispense', protect, authorize('admin', 'pharmacist'), dispensePrescription);
router.get('/dispense/history', protect, authorize('admin', 'pharmacist'), getDispenseHistory);
router.get('/:id', protect, getMedicineById);
router.put('/:id', protect, authorize('admin', 'pharmacist'), updateMedicine);
router.delete('/:id', protect, authorize('admin'), deleteMedicine);

module.exports = router;