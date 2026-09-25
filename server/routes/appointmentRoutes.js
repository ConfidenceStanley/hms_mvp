const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateStatus,
  getAvailableSlots,
  getTodayAppointments
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'receptionist', 'patient'), createAppointment);
router.get('/', protect, getAllAppointments);
router.get('/today', protect, getTodayAppointments);
router.get('/available-slots', protect, getAvailableSlots);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, authorize('admin', 'doctor', 'receptionist'), updateStatus);

module.exports = router;