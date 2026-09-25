import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import {
  FaPills,
  FaCheck,
  FaUserInjured,
  FaPrescriptionBottleAlt,
  FaReceipt
} from 'react-icons/fa';

const PharmacyDispensePage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dispenseItems, setDispenseItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueueAndInventory();
  }, []);

  const fetchQueueAndInventory = async () => {
    try {
      setLoading(true);
      const [pRes, mRes] = await Promise.all([
        API.get('/pharmacy/prescriptions/pending'),
        API.get('/pharmacy')
      ]);
      setPrescriptions(pRes.data.data.records);
      setMedicines(mRes.data.data.medicines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrescription = (record) => {
    setSelectedRecord(record);
    // Map prescribed drugs to dispensary stock items
    const items = record.prescription.map((p) => {
      // Find matching medicine in stock by name
      const match = medicines.find(
        (m) => m.name.toLowerCase().includes(p.medicineName.toLowerCase()) ||
               p.medicineName.toLowerCase().includes(m.name.toLowerCase())
      );

      return {
        prescribedName: p.medicineName,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
        medicineId: match ? match._id : '',
        quantityDispensed: 1,
        unitPrice: match ? match.unitPrice : 0,
        availableStock: match ? match.quantityInStock : 0
      };
    });

    setDispenseItems(items);
  };

  const handleItemChange = (idx, field, value) => {
    const updated = [...dispenseItems];
    updated[idx][field] = value;

    if (field === 'medicineId') {
      const match = medicines.find((m) => m._id === value);
      if (match) {
        updated[idx].unitPrice = match.unitPrice;
        updated[idx].availableStock = match.quantityInStock;
      }
    }

    setDispenseItems(updated);
  };

  const calculateTotal = () => {
    return dispenseItems.reduce((acc, item) => {
      return acc + (Number(item.unitPrice) * Number(item.quantityDispensed) || 0);
    }, 0);
  };

  const handleDispense = async () => {
    // Validate that all items have chosen a medicine
    for (const item of dispenseItems) {
      if (!item.medicineId) {
        return toast.error(`Please select a dispensary stock item for "${item.prescribedName}"`);
      }
      if (item.quantityDispensed > item.availableStock) {
        return toast.error(`Stock exceeded for "${item.prescribedName}". Available: ${item.availableStock}`);
      }
    }

    setSubmitting(true);
    try {
      await API.post('/pharmacy/dispense', {
        patientId: selectedRecord.patientId._id,
        medicalRecordId: selectedRecord._id,
        items: dispenseItems
      });

      toast.success('Prescription dispensed & stock updated successfully');
      setSelectedRecord(null);
      setDispenseItems([]);
      fetchQueueAndInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispense medication');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">Prescription Dispensing Desk</h2>
        <p className="text-sm text-slate-400">
          Fulfill digital prescriptions issued by consulting physicians
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Pending Prescriptions List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <FaPrescriptionBottleAlt className="text-primary" />
              <span>Doctor Prescriptions ({prescriptions.length})</span>
            </h3>

            {loading ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            ) : prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 italic border-2 border-dashed border-slate-100 rounded-xl">
                No pending prescriptions found
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {prescriptions.map((rec) => (
                  <button
                    key={rec._id}
                    onClick={() => handleSelectPrescription(rec)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedRecord?._id === rec._id
                        ? 'bg-blue-50 border-primary text-navy shadow-sm'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-navy">{rec.patientId?.fullName}</span>
                      <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded border border-blue-100">
                        {rec.prescription?.length} Drugs
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      ID: {rec.patientId?.patientId} &bull; Dr. {rec.doctorId?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(rec.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Dispense Action Desk */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-scaleIn">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-navy">
                    Dispensing for {selectedRecord.patientId?.fullName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Patient ID: {selectedRecord.patientId?.patientId} &bull; Consultant: Dr. {selectedRecord.doctorId?.name}
                  </p>
                </div>
                <span className="text-xs font-bold bg-green-50 text-success px-3 py-1 rounded-full border border-green-100">
                  Ready to Issue
                </span>
              </div>

              {/* Items mapping table */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Map Prescribed Regimen to Stock Inventory
                </h4>

                {dispenseItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3"
                  >
                    <div className="flex justify-between text-xs">
                      <div>
                        <strong className="text-navy font-bold">{item.prescribedName}</strong>
                        <p className="text-slate-400">
                          {item.dosage} &bull; {item.frequency} &bull; {item.duration}
                        </p>
                      </div>
                      <span className="text-slate-500 font-medium text-right">
                        Available Stock: <strong className="text-navy">{item.availableStock}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Select Stock Drug Item *
                        </label>
                        <select
                          value={item.medicineId}
                          onChange={(e) => handleItemChange(idx, 'medicineId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-primary outline-none"
                        >
                          <option value="">-- Choose matching dispensary drug --</option>
                          {medicines.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name} ({m.strength}) - Stock: {m.quantityInStock} - {formatCurrency(m.unitPrice)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Units to Dispense *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={item.availableStock}
                          value={item.quantityDispensed}
                          onChange={(e) => handleItemChange(idx, 'quantityDispensed', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill & Summary */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaReceipt className="text-2xl text-primary" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Calculated Medication Total</p>
                    <p className="text-xl font-extrabold text-navy">
                      {formatCurrency(calculateTotal())}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDispense}
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-success to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-success/30 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Dispensing...' : <><FaCheck className="text-xs" /> Issue & Deduct Stock</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-16 rounded-2xl border border-slate-100 text-center text-slate-400">
              <FaPills className="text-5xl mx-auto mb-3 text-slate-200" />
              <h3 className="font-bold text-navy mb-1">No Prescription Selected</h3>
              <p className="text-xs text-slate-400">
                Click a pending doctor prescription from the left queue to dispense medications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDispensePage;