const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const AppError = require('../utils/errorHandler');

exports.createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(new AppError('Patient record not found', 404));
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return next(new AppError('Doctor not available', 404));
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.availableDays.includes(dayName)) {
      return next(new AppError(`Doctor is not available on ${dayName}`, 400));
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['booked', 'in-progress'] }
    });

    if (existingAppointment) {
      return next(new AppError('This time slot is already booked', 400));
    }

    const count = await Appointment.countDocuments();
    const appointmentId = `OMC-APT-${String(count + 1).padStart(6, '0')}`;

    const appointment = await Appointment.create({
      appointmentId,
      patientId,
      doctorId,
      date: appointmentDate,
      timeSlot,
      reason: reason || 'General Consultation',
      bookedBy: req.user.id
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName patientId phone')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .populate('bookedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { appointment: populated }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, date, doctorId, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (doctorProfile) {
        filter.doctorId = doctorProfile._id;
      } else {
        return res.status(200).json({ success: true, data: { appointments: [], pagination: { total: 0, page: 1, pages: 0 } } });
      }
    }

    if (date) {
      const d = new Date(date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patientId', 'fullName patientId phone gender')
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name' }
        })
        .populate('bookedBy', 'name')
        .sort({ date: -1, 'timeSlot.startTime': 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('bookedBy', 'name');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validTransitions = {
      booked: ['in-progress', 'cancelled', 'no-show'],
      'in-progress': ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      'no-show': []
    };

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    if (!validTransitions[appointment.status]?.includes(status)) {
      return next(new AppError(`Cannot change status from '${appointment.status}' to '${status}'`, 400));
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    if (status === 'cancelled') appointment.cancelledReason = req.body.cancelledReason || 'Cancelled by staff';

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName patientId phone')
      .populate({
        path: 'doctorId',
        select: 'specialization',
        populate: { path: 'userId', select: 'name' }
      });

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      data: { appointment: populated }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return next(new AppError('Doctor ID and date are required', 400));
    }

    const doctor = await Doctor.findById(doctorId).select('availableDays availableSlots');
    if (!doctor) {
      return next(new AppError('Doctor not found', 404));
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.availableDays.includes(dayName)) {
      return res.status(200).json({
        success: true,
        data: { available: false, reason: `Doctor is not available on ${dayName}`, slots: [] }
      });
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['booked', 'in-progress'] }
    }).select('timeSlot');

    const bookedTimes = bookedAppointments.map((a) => a.timeSlot.startTime);

    const availableSlots = doctor.availableSlots.filter(
      (slot) => !bookedTimes.includes(slot.startTime)
    );

    res.status(200).json({
      success: true,
      data: {
        available: availableSlots.length > 0,
        slots: availableSlots
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodayAppointments = async (req, res, next) => {
  try {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const filter = { date: { $gte: start, $lte: end } };

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (doctorProfile) {
        filter.doctorId = doctorProfile._id;
      }
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'fullName patientId phone')
      .populate({
        path: 'doctorId',
        select: 'specialization',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ 'timeSlot.startTime': 1 });

    res.status(200).json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    next(error);
  }
};