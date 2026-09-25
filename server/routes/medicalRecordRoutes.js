const express = require('express');
const router = express.Router();
const { createMedicalRecord, getPatientMedicalHistory, getRecordById } = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'doctor'), createMedicalRecord);
router.get('/patient/:patientId', protect, getPatientMedicalHistory);
router.get('/:id', protect, getRecordById);

module.exports = router;