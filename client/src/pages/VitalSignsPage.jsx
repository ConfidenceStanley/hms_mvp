import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaHeartbeat, FaSearch, FaThermometerHalf, FaWeight, FaRulerVertical, FaCheck } from 'react-icons/fa';

const VitalSignsPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({
    temperature: '', bloodPressureSystolic: '', bloodPressureDiastolic: '',
    heartRate: '', respiratoryRate: '', oxygenSaturation: '',
    weight: '', height: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim().length > 1) {
      API.get(`/patients?search=${search}`)
        .then(r => setPatients(r.data.data.patients || []))
        .catch(() => {});
    }
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const calculateBMI = () => {
    if (!form.weight || !form.height) return '0.00';
    const hM = form.height / 100;
    return (form.weight / (hM * hM)).toFixed(2);
  };

  const getBMICategory = (bmi) => {
    const val = parseFloat(bmi);
    if (val === 0) return { text: 'N/A', color: 'text-slate-400 bg-slate-50' };
    if (val < 18.5) return { text: 'Underweight', color: 'text-yellow-600 bg-yellow-50' };
    if (val < 25) return { text: 'Healthy', color: 'text-success bg-green-50' };
    if (val < 30) return { text: 'Overweight', color: 'text-orange-600 bg-orange-50' };
    return { text: 'Obese', color: 'text-danger bg-red-50' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return toast.error('Please select a patient first');
    setLoading(true);

    try {
      await API.post('/vitals', {
        patientId: selectedPatient._id,
        ...form
      });
      toast.success(`Triage complete for ${selectedPatient.fullName}. Vitals forwarded to consultation queue.`);
      setForm({
        temperature: '', bloodPressureSystolic: '', bloodPressureDiastolic: '',
        heartRate: '', respiratoryRate: '', oxygenSaturation: '',
        weight: '', height: '', notes: ''
      });
      setSelectedPatient(null);
      setSearch('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving vital signs');
    } finally {
      setLoading(false);
    }
  };

  const bmiValue = calculateBMI();
  const bmiCat = getBMICategory(bmiValue);
  const inputClass = "w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all bg-slate-50/50";

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 text-danger rounded-2xl shadow-sm">
          <FaHeartbeat className="text-2xl animate-pulse-soft" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Triage Desk (Vitals Recording)</h2>
          <p className="text-sm text-slate-400">Record clinical vitals prior to doctor consultation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Patient Selector */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy mb-4">Patient Search</h3>
            <div className="relative group mb-4">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Type Patient ID or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-primary outline-none text-sm bg-slate-50/50"
              />
            </div>

            {search && patients.length > 0 && (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto border border-slate-100 rounded-xl">
                {patients.map(p => (
                  <button
                    key={p._id}
                    onClick={() => { setSelectedPatient(p); setSearch(''); }}
                    className="w-full text-left p-3 text-xs hover:bg-blue-50 transition-colors flex flex-col gap-1"
                  >
                    <span className="font-bold text-navy">{p.fullName}</span>
                    <span className="text-slate-400 font-medium">{p.patientId} &bull; {p.phone}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedPatient ? (
              <div className="mt-5 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-scaleIn text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                  {selectedPatient.fullName?.charAt(0)}
                </div>
                <h4 className="font-bold text-navy text-sm">{selectedPatient.fullName}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedPatient.patientId}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-red-50 text-danger border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">Blood Group: {selectedPatient.bloodGroup}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic border-2 border-dashed border-slate-100 rounded-xl">No patient selected</p>
            )}
          </div>
        </div>

        {/* Right Side: Recording Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <FaThermometerHalf className="text-primary" />
                  <span>Clinical Diagnostics</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Temp (°C) *</label>
                    <input type="number" step="0.1" name="temperature" value={form.temperature} onChange={handleChange} required className={inputClass} placeholder="e.g., 36.8" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">BP Systolic *</label>
                    <input type="number" name="bloodPressureSystolic" value={form.bloodPressureSystolic} onChange={handleChange} required className={inputClass} placeholder="e.g., 120" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">BP Diastolic *</label>
                    <input type="number" name="bloodPressureDiastolic" value={form.bloodPressureDiastolic} onChange={handleChange} required className={inputClass} placeholder="e.g., 80" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Pulse (bpm) *</label>
                    <input type="number" name="heartRate" value={form.heartRate} onChange={handleChange} required className={inputClass} placeholder="e.g., 72" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Resp Rate (cpm) *</label>
                    <input type="number" name="respiratoryRate" value={form.respiratoryRate} onChange={handleChange} required className={inputClass} placeholder="e.g., 16" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">SpO2 (%) *</label>
                    <input type="number" name="oxygenSaturation" value={form.oxygenSaturation} onChange={handleChange} required className={inputClass} placeholder="e.g., 98" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <FaWeight className="text-primary" />
                  <span>Anthropometry</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Weight (kg) *</label>
                    <input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} required className={inputClass} placeholder="e.g., 75.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Height (cm) *</label>
                    <input type="number" name="height" value={form.height} onChange={handleChange} required className={inputClass} placeholder="e.g., 175" />
                  </div>
                </div>

                {form.weight && form.height && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between animate-scaleIn">
                    <div className="flex items-center gap-3">
                      <FaRulerVertical className="text-slate-300 text-xl" />
                      <div>
                        <p className="text-xs text-slate-400">Calculated Body Mass Index (BMI)</p>
                        <p className="text-lg font-extrabold text-navy">{bmiValue} kg/m²</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${bmiCat.color}`}>
                      {bmiCat.text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Clinical Nurse Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" className={inputClass} placeholder="General comments on patient appearance or symptoms..." />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-danger to-red-600 text-white font-extrabold rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : <><FaCheck className="text-xs" /> Save & Admit to Consultation</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsPage;