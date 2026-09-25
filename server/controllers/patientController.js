const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const AppError = require('../utils/errorHandler');

exports.createPatient = async (req, res, next) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      maritalStatus,
      emergencyContact,
      medicalHistory,
      allergies
    } = req.body;

    // Generate Unique PatientID (Format: OMC-YYYY-XXXXX)
    const currentYear = new Date().getFullYear();
    const count = await Patient.countDocuments();
    const sequence = String(count + 1).padStart(5, '0');
    const patientId = `OMC-${currentYear}-${sequence}`;

    const patient = await Patient.create({
      patientId,
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      maritalStatus,
      emergencyContact,
      medicalHistory: medicalHistory || [],
      allergies: allergies || [],
      registeredBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = {};

    // DOCTOR RESTRICTION: Only see patients assigned via appointments
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });

      if (!doctorProfile) {
        return res.status(200).json({
          success: true,
          data: {
            patients: [],
            pagination: { total: 0, page: 1, pages: 0 }
          }
        });
      }

      // Find all unique patient IDs booked with this doctor
      const assignedPatientIds = await Appointment.find({
        doctorId: doctorProfile._id
      }).distinct('patientId');

      // Filter patients to only assigned ones
      filter._id = { $in: assignedPatientIds };
    }

    // Dynamic Search Filter
    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { patientId: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate('registeredBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Patient.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        patients,
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

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'name');
    if (!patient) {
      return next(new AppError('Patient profile not found', 404));
    }

    // DOCTOR ACCESS CONTROL: Verify patient is assigned to this doctor
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        return next(new AppError('Doctor profile not found', 403));
      }

      const isAssigned = await Appointment.findOne({
        doctorId: doctorProfile._id,
        patientId: patient._id
      });

      if (!isAssigned) {
        return next(
          new AppError('Access denied: You are not assigned to this patient', 403)
        );
      }
    }

    res.status(200).json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!patient) {
      return next(new AppError('Patient profile not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Patient details updated successfully',
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};