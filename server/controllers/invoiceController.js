const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const DispenseLog = require('../models/DispenseLog');
const LabTest = require('../models/LabTest');
const AppError = require('../utils/errorHandler');

exports.generateInvoice = async (req, res, next) => {
  try {
    const { patientId, appointmentId, items, tax, discount, notes } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient not found', 404));

    let invoiceItems = items || [];

    if (appointmentId && (!items || items.length === 0)) {
      const appointment = await Appointment.findById(appointmentId)
        .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

      if (appointment) {
        invoiceItems.push({
          description: `Consultation - ${appointment.doctorId?.userId?.name || 'Doctor'}`,
          category: 'Consultation',
          quantity: 1,
          unitPrice: 5000,
          totalPrice: 5000
        });
      }

      const records = await MedicalRecord.find({ appointmentId });
      for (const record of records) {
        for (const p of record.prescription) {
          invoiceItems.push({
            description: `${p.medicineName} (${p.dosage})`,
            category: 'Medicine',
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0
          });
        }
      }

      const dispenseLogs = await DispenseLog.find({ medicalRecordId: { $in: records.map(r => r._id) } });
      for (const log of dispenseLogs) {
        for (const item of log.items) {
          const existingIdx = invoiceItems.findIndex(
            i => i.description.includes(item.medicineName) && i.category === 'Medicine' && i.unitPrice === 0
          );
          if (existingIdx >= 0) {
            invoiceItems[existingIdx].unitPrice = item.unitPrice;
            invoiceItems[existingIdx].quantity = item.quantityDispensed;
            invoiceItems[existingIdx].totalPrice = item.totalPrice;
          }
        }
      }

      const labTests = await LabTest.find({
        patientId,
        status: 'completed',
        _id: { $in: records.flatMap(r => r.linkedLabTests) }
      });
      for (const lab of labTests) {
        invoiceItems.push({
          description: `Lab: ${lab.testName}`,
          category: 'Laboratory',
          quantity: 1,
          unitPrice: 3000,
          totalPrice: 3000
        });
      }
    }

    for (const item of invoiceItems) {
      item.totalPrice = item.quantity * item.unitPrice;
    }

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = tax || 0;
    const discountAmount = discount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const count = await Invoice.countDocuments();
    const invoiceId = `OMC-INV-${String(count + 1).padStart(6, '0')}`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = await Invoice.create({
      invoiceId,
      patientId,
      appointmentId: appointmentId || null,
      items: invoiceItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      paymentStatus: 'unpaid',
      dueDate,
      generatedBy: req.user.id,
      notes: notes || ''
    });

    const populated = await Invoice.findById(invoice._id)
      .populate('patientId', 'fullName patientId phone')
      .populate('generatedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully',
      data: { invoice: populated }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.paymentStatus = status;
    if (search) {
      filter.$or = [
        { invoiceId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('patientId', 'fullName patientId phone')
        .populate('generatedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Invoice.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        invoices,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patientId')
      .populate('appointmentId')
      .populate('generatedBy', 'name');

    if (!invoice) return next(new AppError('Invoice not found', 404));

    const payments = await Payment.find({ invoiceId: invoice._id })
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { invoice, payments }
    });
  } catch (error) {
    next(error);
  }
};

exports.recordPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod, transactionReference, notes } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) return next(new AppError('Invoice not found', 404));
    if (invoice.paymentStatus === 'paid') return next(new AppError('Invoice is already fully paid', 400));
    if (amount > invoice.balanceDue) return next(new AppError(`Amount exceeds balance due (₦${invoice.balanceDue})`, 400));

    const count = await Payment.countDocuments();
    const paymentId = `OMC-PAY-${String(count + 1).padStart(6, '0')}`;

    const payment = await Payment.create({
      paymentId,
      invoiceId: invoice._id,
      amount,
      paymentMethod,
      transactionReference: transactionReference || '',
      status: 'success',
      processedBy: req.user.id,
      notes: notes || ''
    });

    invoice.amountPaid += Number(amount);
    invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
    invoice.paymentMethod = paymentMethod;

    if (invoice.balanceDue <= 0) {
      invoice.paymentStatus = 'paid';
      invoice.balanceDue = 0;
    } else {
      invoice.paymentStatus = 'partial';
    }

    invoice.paymentDate = new Date();
    await invoice.save();

    res.status(200).json({
      success: true,
      message: `Payment of ₦${Number(amount).toLocaleString()} recorded successfully`,
      data: { payment, invoice }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalRevenue, monthlyRevenue, todayRevenue, unpaidTotal, totalInvoices, paidInvoices] = await Promise.all([
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Invoice.aggregate([{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Invoice.aggregate([{ $match: { createdAt: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
      Invoice.aggregate([{ $match: { paymentStatus: { $in: ['unpaid', 'partial'] } } }, { $group: { _id: null, total: { $sum: '$balanceDue' } } }]),
      Invoice.countDocuments(),
      Invoice.countDocuments({ paymentStatus: 'paid' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        unpaidTotal: unpaidTotal[0]?.total || 0,
        totalInvoices,
        paidInvoices
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({ path: 'invoiceId', populate: { path: 'patientId', select: 'fullName patientId' } })
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: { payments } });
  } catch (error) {
    next(error);
  }
};