import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

const AppointmentBookingPage = () => {
  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', startTime: '', endTime: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/patients?limit=100').then((r) => setPatients(r.data.data.patients)).catch(() => {});
    API.get('/doctors').then((r) => setDoctors(r.data.data.doctors)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.doctorId && form.date) {
      setFetchingSlots(true);
      API.get(`/appointments/available-slots?doctorId=${form.doctorId}&date=${form.date}`)
        .then((r) => setSlots(r.data.data.slots || []))
        .catch(() => setSlots([]))
        .finally(() => setFetchingSlots(false));
    }
  }, [form.doctorId, form.date]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectSlot = (slot) => setForm({ ...form, startTime: slot.startTime, endTime: slot.endTime });

  const selectedDoctor = doctors.find((d) => d._id === form.doctorId);
  const selectedPatient = patients.find((p) => p._id === form.patientId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/appointments', {
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date,
        timeSlot: { startTime: form.startTime, endTime: form.endTime },
        reason: form.reason
      });
      toast.success('Appointment booked successfully');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm';

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-2">Book Appointment</h2>
      <p className="text-sm text-gray-500 mb-6">Schedule a clinical consultation at Oronna Medical Complex</p>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step >= s ? 'text-navy' : 'text-gray-400'}`}>
              {s === 1 ? 'Patient' : s === 2 ? 'Doctor & Date' : 'Confirm'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-navy mb-4">Select Patient</h3>
            <select name="patientId" value={form.patientId} onChange={handleChange} required className={inputClass}>
              <option value="">Search and select a patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>{p.patientId} - {p.fullName} ({p.phone})</option>
              ))}
            </select>
            <button type="button" onClick={() => form.patientId && setStep(2)} className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:bg-blue-300" disabled={!form.patientId}>
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy mb-2">Select Doctor and Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Doctor *</label>
                <select name="doctorId" value={form.doctorId} onChange={handleChange} required className={inputClass}>
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.userId?.name} - {d.specialization} ({formatCurrency(d.consultationFee)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Appointment Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} min={today} required className={inputClass} />
              </div>
            </div>

            {form.doctorId && form.date && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Available Time Slots</label>
                {fetchingSlots ? (
                  <p className="text-sm text-gray-400">Loading slots...</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-red-500 font-semibold">No available slots for this date. Doctor may not be available.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSlot(slot)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          form.startTime === slot.startTime
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-primary'
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Reason for Visit</label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} className={inputClass} placeholder="e.g., Routine checkup, Malaria treatment" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Back</button>
              <button type="button" onClick={() => form.doctorId && form.date && form.startTime && setStep(3)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:bg-blue-300" disabled={!form.doctorId || !form.date || !form.startTime}>
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-navy mb-4">Confirm Appointment</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Patient:</span><span className="font-bold text-navy">{selectedPatient?.fullName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Patient ID:</span><span className="font-bold text-navy">{selectedPatient?.patientId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="font-bold text-navy">{selectedDoctor?.userId?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Specialization:</span><span className="font-bold text-navy">{selectedDoctor?.specialization}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-bold text-navy">{new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-bold text-navy">{form.startTime} - {form.endTime}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reason:</span><span className="font-bold text-navy">{form.reason || 'General Consultation'}</span></div>
              <div className="flex justify-between border-t border-blue-200 pt-2"><span className="text-gray-500">Consultation Fee:</span><span className="font-extrabold text-primary">{formatCurrency(selectedDoctor?.consultationFee || 0)}</span></div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Back</button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-success text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-300">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentBookingPage;