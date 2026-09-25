import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaCalendarCheck, FaUserInjured, FaUserMd, FaCheck } from 'react-icons/fa';

const AppointmentBookingPage = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';

  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/patients?limit=100')
      .then((r) => setPatients(r.data.data.patients))
      .catch(() => {});
    API.get('/doctors')
      .then((r) => setDoctors(r.data.data.doctors))
      .catch(() => {});
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
  const inputClass = 'w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all bg-slate-50/50';

  const stepLabels = ['Patient', 'Doctor & Date', 'Confirm'];

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-extrabold text-navy mb-2">
        {isDoctor ? 'Schedule Follow-up Appointment' : 'Book Appointment'}
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        {isDoctor
          ? 'Schedule a follow-up visit for an existing patient'
          : 'Schedule a clinical consultation at Oronna Medical Complex'}
      </p>

      {isDoctor && (
        <div className="bg-amber-50 border-l-4 border-warning rounded-lg p-4 mb-6 flex items-start gap-3 animate-fadeInUp">
          <div className="p-2 bg-warning/10 rounded-lg flex-shrink-0">
            <FaCalendarCheck className="text-warning" />
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-bold mb-1">Doctor Booking Restrictions</p>
            <p className="text-xs text-slate-500">
              You can only schedule follow-up appointments for patients you have previously consulted. Select yourself as the doctor.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 animate-fadeInUp">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step > s
                  ? 'bg-success text-white shadow-lg shadow-success/30'
                  : step === s
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/30 scale-110'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? <FaCheck className="text-xs" /> : s}
            </div>
            <span
              className={`text-xs font-bold hidden sm:inline transition-colors ${
                step >= s ? 'text-navy' : 'text-slate-300'
              }`}
            >
              {stepLabels[s - 1]}
            </span>
            {s < 3 && (
              <div
                className={`w-8 sm:w-12 h-0.5 transition-colors ${step > s ? 'bg-success' : 'bg-slate-100'}`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <FaUserInjured className="text-primary text-lg" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-navy">Select Patient</h3>
                <p className="text-xs text-slate-400">Choose the patient for this appointment</p>
              </div>
            </div>

            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Patient *</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Search and select a patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.patientId} - {p.fullName} ({p.phone})
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center gap-3 animate-fadeInUp">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-bold text-sm">
                  {selectedPatient.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy text-sm">{selectedPatient.fullName}</p>
                  <p className="text-xs text-slate-500">
                    {selectedPatient.patientId} &middot; {selectedPatient.phone}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => form.patientId && setStep(2)}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!form.patientId}
            >
              Continue &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <FaUserMd className="text-primary text-lg" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-navy">Select Doctor & Date</h3>
                <p className="text-xs text-slate-400">Pick the practitioner and time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Doctor *</label>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.userId?.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Appointment Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {form.doctorId && form.date && (
              <div className="animate-fadeInUp">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Available Time Slots</label>
                {fetchingSlots ? (
                  <div className="flex items-center gap-2 py-3">
                    <div className="w-4 h-4 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                    <span className="text-sm text-slate-400">Loading slots...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 bg-red-50 border-l-4 border-danger rounded-lg">
                    <p className="text-sm text-danger font-bold">No available slots for this date.</p>
                    <p className="text-xs text-slate-500 mt-1">The doctor may not be scheduled to work on this day, or all slots are booked.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSlot(slot)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                          form.startTime === slot.startTime
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20 scale-105'
                            : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-primary border border-slate-100'
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
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Reason for Visit</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Routine checkup, Malaria treatment, Follow-up"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={() => form.doctorId && form.date && form.startTime && setStep(3)}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!form.doctorId || !form.date || !form.startTime}
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-success/10 rounded-xl">
                <FaCheck className="text-success text-lg" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-navy">Confirm Appointment</h3>
                <p className="text-xs text-slate-400">Review the details before confirming</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 space-y-3 text-sm mb-6 border border-blue-100">
              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-bold">
                    {selectedPatient?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-navy">{selectedPatient?.fullName}</p>
                    <p className="text-xs text-slate-500">{selectedPatient?.patientId}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-primary">Patient</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-white font-bold">
                    {selectedDoctor?.userId?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-navy">{selectedDoctor?.userId?.name}</p>
                    <p className="text-xs text-primary font-bold">{selectedDoctor?.specialization}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-success">Doctor</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="font-bold text-navy">
                    {new Date(form.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Time</span>
                  <span className="font-bold text-navy">
                    {form.startTime} - {form.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Reason</span>
                  <span className="font-bold text-navy">{form.reason || 'General Consultation'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-success to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-success/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentBookingPage;