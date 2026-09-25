const LabTest = require('../models/LabTest');
const Patient = require('../models/Patient');
const AppError = require('../utils/errorHandler');

exports.requestLabTest = async (req, res, next) => {
  try {
    const { patientId, testName, category, priority } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient not found', 404));

    const count = await LabTest.countDocuments();
    const testId = `OMC-LAB-${String(count + 1).padStart(5, '0')}`;

    const test = await LabTest.create({
      testId,
      patientId,
      doctorId: req.user.id,
      testName,
      category,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Laboratory investigation requested',
      data: { test }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllLabRequests = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tests, total] = await Promise.all([
      LabTest.find(filter)
        .populate('patientId', 'fullName patientId phone gender dateOfBirth')
        .populate('doctorId', 'name')
        .populate('technicianId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LabTest.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        tests,
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

exports.updateLabStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const test = await LabTest.findById(req.params.id);

    if (!test) return next(new AppError('Lab test request not found', 404));

    test.status = status;
    test.technicianId = req.user.id;
    await test.save();

    res.status(200).json({
      success: true,
      message: `Test status updated to ${status}`,
      data: { test }
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadLabResults = async (req, res, next) => {
  try {
    const { results, technicianNotes } = req.body;
    const test = await LabTest.findById(req.params.id);

    if (!test) return next(new AppError('Lab test request not found', 404));

    if (test.status === 'completed') {
      return next(new AppError('This test has already been completed', 400));
    }

    test.results = results;
    test.technicianNotes = technicianNotes;
    test.status = 'completed';
    test.technicianId = req.user.id;
    test.completedAt = new Date();
    await test.save();

    res.status(200).json({
      success: true,
      message: 'Laboratory results uploaded successfully',
      data: { test }
    });
  } catch (error) {
    next(error);
  }
};