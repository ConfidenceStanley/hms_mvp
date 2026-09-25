const express = require('express');
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'receptionist'), createPatient);
router.get('/', protect, authorize('admin', 'receptionist', 'doctor', 'nurse'), getAllPatients);
router.get('/:id', protect, authorize('admin', 'receptionist', 'doctor', 'nurse'), getPatientById);
router.put('/:id', protect, authorize('admin', 'receptionist'), updatePatient);

module.exports = router;