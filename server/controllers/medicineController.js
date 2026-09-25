const Medicine = require('../models/Medicine');
const DispenseLog = require('../models/DispenseLog');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const AppError = require('../utils/errorHandler');

exports.addMedicine = async (req, res, next) => {
  try {
    const {
      name,
      genericName,
      category,
      dosageForm,
      strength,
      unitPrice,
      quantityInStock,
      reorderLevel,
      expiryDate,
      batchNumber,
      manufacturer
    } = req.body;

    const count = await Medicine.countDocuments();
    const itemCode = `OMC-MED-${String(count + 1).padStart(5, '0')}`;

    const medicine = await Medicine.create({
      itemCode,
      name,
      genericName,
      category,
      dosageForm,
      strength,
      unitPrice,
      quantityInStock,
      reorderLevel: reorderLevel || 20,
      expiryDate,
      batchNumber,
      manufacturer
    });

    res.status(201).json({
      success: true,
      message: 'Medicine added to dispensary inventory',
      data: { medicine }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllMedicines = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;

    let medicines = await Medicine.find(filter).sort({ name: 1 });

    if (search) {
      const term = search.toLowerCase();
      medicines = medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.genericName.toLowerCase().includes(term) ||
          m.itemCode.toLowerCase().includes(term)
      );
    }

    // Filter by stock alerts if requested
    if (status === 'low-stock') {
      medicines = medicines.filter((m) => m.quantityInStock <= m.reorderLevel);
    } else if (status === 'expiring') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      medicines = medicines.filter((m) => new Date(m.expiryDate) <= thirtyDaysFromNow);
    }

    res.status(200).json({
      success: true,
      data: { medicines }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return next(new AppError('Medicine not found in inventory', 404));

    res.status(200).json({
      success: true,
      data: { medicine }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!medicine) return next(new AppError('Medicine not found in inventory', 404));

    res.status(200).json({
      success: true,
      message: 'Medicine details updated',
      data: { medicine }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!medicine) return next(new AppError('Medicine not found', 404));

    res.status(200).json({
      success: true,
      message: 'Medicine removed from active dispensary'
    });
  } catch (error) {
    next(error);
  }
};

// Prescription Queue for Pharmacists
exports.getPendingPrescriptions = async (req, res, next) => {
  try {
    // Fetch recent EMR records that contain prescriptions
    const records = await MedicalRecord.find({
      'prescription.0': { $exists: true }
    })
      .populate('patientId', 'fullName patientId phone gender dateOfBirth')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: { records }
    });
  } catch (error) {
    next(error);
  }
};

// Dispense Medicines & Deduct Inventory Stock
exports.dispensePrescription = async (req, res, next) => {
  try {
    const { patientId, medicalRecordId, items, notes } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient not found', 404));

    let totalBill = 0;
    const validatedItems = [];

    // Check stock availability and decrease quantity
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return next(new AppError(`Medicine with ID ${item.medicineId} not found`, 404));
      }

      if (medicine.quantityInStock < item.quantityDispensed) {
        return next(
          new AppError(
            `Insufficient stock for ${medicine.name}. Available: ${medicine.quantityInStock}, Requested: ${item.quantityDispensed}`,
            400
          )
        );
      }

      // Deduct inventory
      medicine.quantityInStock -= Number(item.quantityDispensed);
      await medicine.save();

      const itemTotal = medicine.unitPrice * Number(item.quantityDispensed);
      totalBill += itemTotal;

      validatedItems.push({
        medicineId: medicine._id,
        medicineName: `${medicine.name} (${medicine.strength})`,
        dosage: item.dosage || medicine.strength,
        quantityDispensed: Number(item.quantityDispensed),
        unitPrice: medicine.unitPrice,
        totalPrice: itemTotal
      });
    }

    const count = await DispenseLog.countDocuments();
    const dispenseId = `OMC-DISP-${String(count + 1).padStart(5, '0')}`;

    const log = await DispenseLog.create({
      dispenseId,
      patientId,
      pharmacistId: req.user.id,
      medicalRecordId: medicalRecordId || null,
      items: validatedItems,
      totalBill,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Prescription dispensed & inventory adjusted successfully',
      data: { dispenseLog: log }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDispenseHistory = async (req, res, next) => {
  try {
    const logs = await DispenseLog.find()
      .populate('patientId', 'fullName patientId phone')
      .populate('pharmacistId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};