const express = require('express');
const router = express.Router();
const { recordVitals, getPatientVitals, getLatestVitals } = require('../controllers/vitalSignController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'nurse', 'doctor'), recordVitals);
router.get('/patient/:patientId', protect, getPatientVitals);
router.get('/patient/:patientId/latest', protect, getLatestVitals);

module.exports = router;