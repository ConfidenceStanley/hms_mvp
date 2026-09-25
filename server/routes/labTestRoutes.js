const express = require('express');
const router = express.Router();
const { requestLabTest, getAllLabRequests, updateLabStatus, uploadLabResults } = require('../controllers/labTestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'doctor'), requestLabTest);
router.get('/', protect, authorize('admin', 'lab_technician', 'doctor'), getAllLabRequests);
router.put('/:id/status', protect, authorize('admin', 'lab_technician'), updateLabStatus);
router.put('/:id/results', protect, authorize('admin', 'lab_technician'), uploadLabResults);

module.exports = router;