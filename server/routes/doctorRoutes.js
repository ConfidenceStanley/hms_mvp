const express = require('express');
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorSchedule
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadDoctorImage } = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('admin'), uploadDoctorImage.single('profileImage'), createDoctor);
router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById);
router.put('/:id', protect, authorize('admin', 'doctor'), uploadDoctorImage.single('profileImage'), updateDoctor);
router.get('/:id/schedule', protect, getDoctorSchedule);

module.exports = router;