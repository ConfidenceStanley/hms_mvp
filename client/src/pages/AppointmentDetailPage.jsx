import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaHeartbeat,
  FaUserInjured,
  FaUserMd,
  FaFileMedical,
  FaClock,
  FaCheck
} from 'react-icons/fa';

const statusColors = {
  booked: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  'no-show': 'bg-slate-100 text-slate-500 border-slate-200'
};

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/appointments/${id}`)
      .then((r) => {
        const appointment = r.data.data.appointment;
        setApt(appointment);
        if (appointment?.patientId?._id) {
          API.get(`/vitals/patient/${appointment.patientId._id}/latest`)
            .then((vRes) => setVitals(vRes.data.data.vital))
            .catch(() => {});
        }
      })
      .catch(() => toast.error('Failed to load appointment'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (!confirm(`Mark this appointment as "${newStatus}"?`)) return;
    setUpdating(true);
    try {
      const res = await API.put(`/appointments/${id}/status`, { status: newStatus });
      setApt(res.data.data.appointment);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <FaCalendarCheck className="text-5xl text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 mb-4 font-medium">Appointment not found.</p>
        <button
          onClick={() => navigate('/appointments')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to list</span>
        </button>
      </div>
    );
  }

  const canUpdate = ['admin', 'doctor', 'receptionist'].includes(user?.role);
  const isActive = apt.status === 'booked' || apt.status === 'in-progress';
  const isDoctor = user?.role === 'doctor';

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/appointments')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
        >
          <FaArrowLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-navy">Appointment Details</h2>
          <p className="text-xs text-slate-400 font-semibold">{apt.appointmentId}</p>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${statusColors[apt.status]}`}
        >
          {apt.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Patient Information Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
          <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <FaUserInjured className="text-primary" />
            <span>Patient Information</span>
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {apt.patientId?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-extrabold text-navy text-base">{apt.patientId?.fullName}</p>
              <p className="text-xs text-primary font-bold">{apt.patientId?.patientId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs font-medium">Phone</p>
              <p className="font-bold text-slate-700 text-sm">{apt.patientId?.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">Gender</p>
              <p className="font-bold text-slate-700 text-sm capitalize">{apt.patientId?.gender}</p>
            </div>
            {apt.patientId?.bloodGroup && (
              <div>
                <p className="text-slate-400 text-xs font-medium">Blood Group</p>
                <span className="inline-block mt-0.5 bg-red-50 text-danger font-extrabold px-2 py-0.5 rounded text-xs border border-red-100">
                  {apt.patientId.bloodGroup}
                </span>
              </div>
            )}
            {apt.patientId?.dateOfBirth && (
              <div>
                <p className="text-slate-400 text-xs font-medium">Date of Birth</p>
                <p className="font-bold text-slate-700 text-sm">
                  {new Date(apt.patientId.dateOfBirth).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Doctor and Schedule Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
          <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <FaUserMd className="text-primary" />
            <span>Doctor & Schedule</span>
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {apt.doctorId?.userId?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-extrabold text-navy text-base">{apt.doctorId?.userId?.name}</p>
              <p className="text-xs text-primary font-bold">{apt.doctorId?.specialization}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1">
                <FaCalendarCheck className="text-slate-300" />
                <span>Date</span>
              </p>
              <p className="font-bold text-navy">
                {new Date(apt.date).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1">
                <FaClock className="text-slate-300" />
                <span>Time</span>
              </p>
              <p className="font-bold text-navy">
                {apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-slate-400 text-xs font-medium mb-1">Reason for Visit</p>
              <p className="font-bold text-navy truncate">{apt.reason || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Triage Status Card */}
        <div
          className={`p-6 rounded-2xl border-2 shadow-sm animate-fadeInUp ${
            vitals ? 'bg-green-50/70 border-green-200' : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <h3 className="text-sm font-bold text-navy border-b border-white/60 pb-3 mb-4 flex items-center gap-2">
            <FaHeartbeat
              className={vitals ? 'text-success animate-pulse-soft' : 'text-warning'}
            />
            <span>Nursing Triage Status</span>
            {vitals ? (
              <span className="ml-auto bg-success text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                Completed
              </span>
            ) : (
              <span className="ml-auto bg-warning text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                Pending
              </span>
            )}
          </h3>

          {vitals ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">Temperature</p>
                  <p className="font-extrabold text-navy text-base">{vitals.temperature}°C</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">Blood Pressure</p>
                  <p className="font-extrabold text-navy text-base">
                    {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">Pulse</p>
                  <p className="font-extrabold text-navy text-base">
                    {vitals.heartRate} <span className="text-xs text-slate-400 font-medium">bpm</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">SpO2</p>
                  <p className="font-extrabold text-navy text-base">{vitals.oxygenSaturation}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">Weight</p>
                  <p className="font-extrabold text-navy text-base">{vitals.weight} kg</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">Height</p>
                  <p className="font-extrabold text-navy text-base">{vitals.height} cm</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100 hover:scale-[1.02] transition-transform">
                  <p className="text-slate-400 font-medium mb-1">BMI</p>
                  <p className="font-extrabold text-navy text-base">{vitals.bmi}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-green-100">
                  <p className="text-slate-400 font-medium mb-1">Recorded By</p>
                  <p className="font-bold text-navy text-[11px] truncate">
                    {vitals.recorderId?.name || 'Nurse'}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-success font-bold flex items-center gap-1 mt-2">
                <FaCheck />
                <span>
                  Triaged on {new Date(vitals.createdAt).toLocaleString('en-GB')}
                </span>
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <FaHeartbeat className="text-4xl text-amber-300 mx-auto mb-2 animate-pulse-soft" />
              <p className="text-amber-800 font-extrabold text-sm">Triage Not Yet Completed</p>
              <p className="text-xs text-amber-600 mt-1 max-w-md mx-auto">
                The nursing team has not yet recorded vital signs for this patient. The doctor should
                wait for triage completion before starting the consultation.
              </p>
            </div>
          )}
        </div>

        {/* Clinical Notes Card (only if notes exist) */}
        {apt.notes && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FaFileMedical className="text-primary" />
              <span>Clinical Notes</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {apt.notes}
            </p>
          </div>
        )}

        {/* Cancellation Reason (if cancelled) */}
        {apt.status === 'cancelled' && apt.cancelledReason && (
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 animate-fadeInUp">
            <h3 className="text-sm font-bold text-danger mb-2">Cancellation Reason</h3>
            <p className="text-sm text-red-700">{apt.cancelledReason}</p>
          </div>
        )}

        {/* Action Buttons */}
        {canUpdate && isActive && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-3 mb-4">
              Clinical Action Gate
            </h3>

            {isDoctor && apt.status === 'in-progress' && (
              <div className="mb-4">
                {vitals ? (
                  <button
                    onClick={() => navigate(`/records/consultation/${apt._id}`)}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-extrabold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FaFileMedical />
                    <span>Conduct Active EMR Consultation</span>
                  </button>
                ) : (
                  <div className="p-4 bg-amber-50 border-l-4 border-warning rounded-lg mb-3">
                    <p className="text-sm font-bold text-amber-800">Triage Required</p>
                    <p className="text-xs text-amber-600 mt-1">
                      Please wait for the nursing team to complete triage vitals before conducting the consultation.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {apt.status === 'booked' && (
                <>
                  <button
                    onClick={() => updateStatus('in-progress')}
                    disabled={updating}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50"
                  >
                    Start Consultation
                  </button>
                  <button
                    onClick={() => updateStatus('no-show')}
                    disabled={updating}
                    className="px-5 py-2.5 bg-slate-500 text-white font-bold rounded-xl text-sm hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    Mark No Show
                  </button>
                </>
              )}
              {apt.status === 'in-progress' && !isDoctor && (
                <button
                  onClick={() => updateStatus('completed')}
                  disabled={updating}
                  className="px-5 py-2.5 bg-gradient-to-r from-success to-emerald-600 text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-success/30 transition-all disabled:opacity-50"
                >
                  Complete Consultation
                </button>
              )}
              <button
                onClick={() => updateStatus('cancelled')}
                disabled={updating}
                className="px-5 py-2.5 bg-danger text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailPage;