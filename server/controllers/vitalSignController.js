const VitalSign = require('../models/VitalSign');
const Patient = require('../models/Patient');
const AppError = require('../utils/errorHandler');

exports.recordVitals = async (req, res, next) => {
  try {
    const {
      patientId,
      temperature,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      respiratoryRate,
      oxygenSaturation,
      weight,
      height,
      notes
    } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient profile not found', 404));

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    const vital = await VitalSign.create({
      patientId,
      recorderId: req.user.id,
      temperature,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      respiratoryRate,
      oxygenSaturation,
      weight,
      height,
      bmi,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Patient triage vitals logged successfully',
      data: { vital }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientVitals = async (req, res, next) => {
  try {
    const vitals = await VitalSign.find({ patientId: req.params.patientId })
      .populate('recorderId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestVitals = async (req, res, next) => {
  try {
    const vital = await VitalSign.findOne({ patientId: req.params.patientId })
      .populate('recorderId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { vital }
    });
  } catch (error) {
    next(error);
  }
};