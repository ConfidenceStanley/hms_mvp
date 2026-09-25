const Doctor = require('../models/Doctor');
const User = require('../models/User');
const AppError = require('../utils/errorHandler');

exports.createDoctor = async (req, res, next) => {
  try {
    const {
      userId,
      specialization,
      department,
      qualifications,
      experience,
      availableDays,
      availableSlots,
      bio
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(new AppError('User account not found', 404));
    if (user.role !== 'doctor') return next(new AppError('Selected user does not have the doctor role', 400));

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) return next(new AppError('Doctor profile already exists for this user', 400));

    const doctorCount = await Doctor.countDocuments();
    const employeeId = `OMC-DR-${String(doctorCount + 1).padStart(4, '0')}`;

    let profileImage = '';
    if (req.file) {
      profileImage = `/uploads/doctors/${req.file.filename}`;
    }

    const doctor = await Doctor.create({
      userId,
      employeeId,
      specialization,
      department: department || 'General',
      qualifications: qualifications ? (typeof qualifications === 'string' ? qualifications.split(',').map(s => s.trim()) : qualifications) : [],
      experience: parseInt(experience) || 0,
      profileImage,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: availableSlots || [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '13:00', endTime: '14:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' }
      ],
      bio: bio || ''
    });

    const populated = await Doctor.findById(doctor._id).populate('userId', 'name email phone gender');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: { doctor: populated }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, department, search } = req.query;
    const filter = { isActive: true };

    if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
    if (department) filter.department = { $regex: department, $options: 'i' };

    let doctors = await Doctor.find(filter).populate('userId', 'name email phone gender').sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter((d) => {
        const name = d.userId?.name?.toLowerCase() || '';
        const spec = d.specialization?.toLowerCase() || '';
        const dept = d.department?.toLowerCase() || '';
        return name.includes(term) || spec.includes(term) || dept.includes(term);
      });
    }

    res.status(200).json({ success: true, data: { doctors } });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone gender dateOfBirth address');
    if (!doctor) return next(new AppError('Doctor profile not found', 404));
    res.status(200).json({ success: true, data: { doctor } });
  } catch (error) {
    next(error);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.profileImage = `/uploads/doctors/${req.file.filename}`;
    }

    if (updates.qualifications && typeof updates.qualifications === 'string') {
      updates.qualifications = updates.qualifications.split(',').map(s => s.trim());
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('userId', 'name email phone gender');

    if (!doctor) return next(new AppError('Doctor profile not found', 404));

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated',
      data: { doctor }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorSchedule = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availableDays availableSlots');
    if (!doctor) return next(new AppError('Doctor not found', 404));
    res.status(200).json({ success: true, data: { availableDays: doctor.availableDays, availableSlots: doctor.availableSlots } });
  } catch (error) {
    next(error);
  }
};