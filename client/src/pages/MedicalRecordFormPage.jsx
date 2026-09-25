import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaFileMedical, FaPrescription, FaHeartbeat, FaFlask, FaCheck } from 'react-icons/fa';

const MedicalRecordFormPage = () => {
  const { appointmentId } = useParams();
  const [apt, setApt] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [form, setForm] = useState({ chiefComplaint: '', clinicalNotes: '', diagnosis: '', treatmentPlan: '' });
  const [prescription, setPrescription] = useState([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [labs, setLabs] = useState([{ testName: '', category: 'Haematology', priority: 'routine' }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/appointments/${appointmentId}`)
      .then((res) => {
        const appointment = res.data.data.appointment;
        setApt(appointment);
        return API.get(`/vitals/patient/${appointment.patientId._id}/latest`);
      })
      .then((resV) => setVitals(resV.data.data.vital))
      .catch(() => {});
  }, [appointmentId]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updatePrescriptionRow = (index, field, value) => {
    const updated = [...prescription];
    updated[index][field] = value;
    setPrescription(updated);
  };

  const addPrescriptionRow = () => {
    setPrescription([...prescription, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removePrescriptionRow = (idx) => {
    setPrescription(prescription.filter((_, i) => i !== idx));
  };

  const updateLabRow = (index, field, value) => {
    const updated = [...labs];
    updated[index][field] = value;
    setLabs(updated);
  };

  const addLabRow = () => {
    setLabs([...labs, { testName: '', category: 'Haematology', priority: 'routine' }]);
  };

  const removeLabRow = (idx) => {
    setLabs(labs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.chiefComplaint || !form.clinicalNotes || !form.diagnosis) {
      return toast.error('All mandatory fields are required');
    }
    setLoading(true);

    try {
      // Step 1: Submit requested labs (if any have text)
      const requestedLabIds = [];
      const validLabs = labs.filter(l => l.testName.trim() !== '');
      for (const lab of validLabs) {
        const labRes = await API.post('/lab', {
          patientId: apt.patientId._id,
          testName: lab.testName,
          category: lab.category,
          priority: lab.priority
        });
        requestedLabIds.push(labRes.data.data.test._id);
      }

      // Step 2: Create EMR medical record
      await API.post('/records', {
        patientId: apt.patientId._id,
        appointmentId: apt._id,
        chiefComplaint: form.chiefComplaint,
        clinicalNotes: form.clinicalNotes,
        diagnosis: form.diagnosis.split(',').map(d => d.trim()),
        prescription: prescription.filter(p => p.medicineName.trim() !== ''),
        treatmentPlan: form.treatmentPlan,
        linkedVitals: vitals ? vitals._id : null,
        linkedLabTests: requestedLabIds
      });

      // Step 3: Complete appointment status
      await API.put(`/appointments/${apt._id}/status`, { status: 'completed' });

      toast.success('Clinical consultation completed & EMR updated');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit medical record');
    } finally {
      setLoading(false);
    }
  };

  if (!apt) return <div className="text-center py-12"><div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" /></div>;

  const inputClass = "w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm bg-slate-50/50 transition-all";

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Consultation Desk</h2>
          <p className="text-sm text-slate-400">Electronic Medical Record (EMR) Clinical Input</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-navy">Patient: {apt.patientId?.fullName}</p>
          <p className="text-slate-400">ID: {apt.patientId?.patientId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Vitals display */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-danger animate-pulse-soft" />
              <span>Latest Triage Vitals</span>
            </h3>
            {vitals ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Temperature</span>
                  <span className="font-bold text-navy">{vitals.temperature} °C</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Blood Pressure</span>
                  <span className="font-bold text-navy">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Pulse (HR)</span>
                  <span className="font-bold text-navy">{vitals.heartRate} bpm</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Oxygen Sat.</span>
                  <span className="font-bold text-navy">{vitals.oxygenSaturation} %</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Weight / Height</span>
                  <span className="font-bold text-navy">{vitals.weight}kg / {vitals.height}cm</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="text-slate-400">BMI</span>
                  <span className="font-bold text-navy">{vitals.bmi}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic border-2 border-dashed border-slate-100 rounded-xl">No triage record found</p>
            )}
          </div>
        </div>

        {/* Right Side: EMR inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <FaFileMedical className="text-primary" />
              <span>Diagnostic Particulars</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Chief Complaint *</label>
              <input type="text" name="chiefComplaint" value={form.chiefComplaint} onChange={handleFormChange} required placeholder="e.g., Fever and chills for 3 days" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Clinical Notes & Findings *</label>
              <textarea name="clinicalNotes" value={form.clinicalNotes} onChange={handleFormChange} required rows="3" placeholder="Symptom analysis, physical examination findings..." className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Diagnoses * (comma separated)</label>
              <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleFormChange} required placeholder="e.g., Malaria, Respiratory Tract Infection" className={inputClass} />
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <FaPrescription className="text-primary" />
              <span>Pharmaceutical Prescription</span>
            </h3>

            <div className="space-y-4">
              {prescription.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end animate-fadeInUp">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Medicine Name</label>
                    <input type="text" value={row.medicineName} onChange={(e) => updatePrescriptionRow(idx, 'medicineName', e.target.value)} placeholder="e.g., Paracetamol" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Dosage</label>
                    <input type="text" value={row.dosage} onChange={(e) => updatePrescriptionRow(idx, 'dosage', e.target.value)} placeholder="e.g., 500mg" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Frequency</label>
                    <input type="text" value={row.frequency} onChange={(e) => updatePrescriptionRow(idx, 'frequency', e.target.value)} placeholder="e.g., 2x daily" className={inputClass} />
                  </div>
                  <div>
                    <button type="button" onClick={() => removePrescriptionRow(idx)} className="px-3 py-2 text-danger hover:bg-red-50 font-bold rounded-xl text-xs">Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addPrescriptionRow} className="text-primary font-bold text-xs hover:underline">+ Add Medicine</button>
            </div>
          </div>

          {/* Laboratory Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <FaFlask className="text-primary" />
              <span>Investigation Requests (Laboratory)</span>
            </h3>

            <div className="space-y-4">
              {labs.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end animate-fadeInUp">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Investigation / Test Name</label>
                    <input type="text" value={row.testName} onChange={(e) => updateLabRow(idx, 'testName', e.target.value)} placeholder="e.g., Malaria Parasite (MP)" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Priority</label>
                    <select value={row.priority} onChange={(e) => updateLabRow(idx, 'priority', e.target.value)} className={inputClass}>
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT (Critical)</option>
                    </select>
                  </div>
                  <div>
                    <button type="button" onClick={() => removeLabRow(idx)} className="px-3 py-2 text-danger hover:bg-red-50 font-bold rounded-xl text-xs">Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addLabRow} className="text-primary font-bold text-xs hover:underline">+ Add Investigation Request</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Treatment & Follow-up Plan</label>
            <textarea name="treatmentPlan" value={form.treatmentPlan} onChange={handleFormChange} rows="2" placeholder="e.g., Bed rest, return for checkup in 5 days..." className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-extrabold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving Clinical Profile...' : <><FaCheck className="text-xs" /> Complete & Save Consultation Entry</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordFormPage;