const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const VitalSign = require('../models/VitalSign');
const LabTest = require('../models/LabTest');
const AppError = require('../utils/errorHandler');

exports.createMedicalRecord = async (req, res, next) => {
  try {
    const {
      patientId,
      appointmentId,
      chiefComplaint,
      clinicalNotes,
      diagnosis,
      prescription,
      treatmentPlan,
      linkedVitals,
      linkedLabTests
    } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient profile not found', 404));

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return next(new AppError('Appointment record not found', 404));

    const count = await MedicalRecord.countDocuments();
    const recordId = `OMC-EMR-${String(count + 1).padStart(5, '0')}`;

    const record = await MedicalRecord.create({
      recordId,
      patientId,
      doctorId: req.user.id,
      appointmentId,
      chiefComplaint,
      clinicalNotes,
      diagnosis,
      prescription: prescription || [],
      treatmentPlan: treatmentPlan || '',
      linkedVitals: linkedVitals || null,
      linkedLabTests: linkedLabTests || []
    });

    appointment.status = 'completed';
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'EMR consultation entry saved successfully',
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientMedicalHistory = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name')
      .populate('linkedVitals')
      .populate('linkedLabTests')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { records }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'fullName patientId phone gender dateOfBirth bloodGroup')
      .populate('doctorId', 'name')
      .populate('linkedVitals')
      .populate('linkedLabTests');

    if (!record) return next(new AppError('EMR file not found', 404));

    res.status(200).json({
      success: true,
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};