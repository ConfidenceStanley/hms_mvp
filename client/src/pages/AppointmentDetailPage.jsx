import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';

const statusColors = {
  booked: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  'no-show': 'bg-gray-100 text-gray-500 border-gray-200'
};

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/appointments/${id}`)
      .then((r) => setApt(r.data.data.appointment))
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
      <div className="flex justify-center p-12">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="p-8 text-center bg-white rounded-xl">
        <p className="text-gray-500">Appointment not found.</p>
        <button onClick={() => navigate('/appointments')} className="mt-4 text-primary font-semibold">Back to list</button>
      </div>
    );
  }

  const canUpdate = ['admin', 'doctor', 'receptionist'].includes(user?.role);
  const isActive = apt.status === 'booked' || apt.status === 'in-progress';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/appointments')} className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <FaArrowLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-navy">Appointment Details</h2>
          <p className="text-xs text-gray-500">{apt.appointmentId}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${statusColors[apt.status]}`}>
          {apt.status}
        </span>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-400 text-xs">Full Name</p><p className="font-bold text-gray-800">{apt.patientId?.fullName}</p></div>
            <div><p className="text-gray-400 text-xs">Patient ID</p><p className="font-bold text-navy">{apt.patientId?.patientId}</p></div>
            <div><p className="text-gray-400 text-xs">Phone</p><p className="font-semibold text-gray-700">{apt.patientId?.phone}</p></div>
            <div><p className="text-gray-400 text-xs">Gender</p><p className="font-semibold text-gray-700 capitalize">{apt.patientId?.gender}</p></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">Doctor and Schedule</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-400 text-xs">Doctor</p><p className="font-bold text-gray-800">{apt.doctorId?.userId?.name}</p></div>
            <div><p className="text-gray-400 text-xs">Specialization</p><p className="font-semibold text-primary">{apt.doctorId?.specialization}</p></div>
            <div><p className="text-gray-400 text-xs">Date</p><p className="font-bold text-gray-800">{new Date(apt.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
            <div><p className="text-gray-400 text-xs">Time</p><p className="font-bold text-gray-800">{apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}</p></div>
            <div><p className="text-gray-400 text-xs">Consultation Fee</p><p className="font-extrabold text-primary">{formatCurrency(apt.doctorId?.consultationFee || 0)}</p></div>
            <div><p className="text-gray-400 text-xs">Reason</p><p className="font-semibold text-gray-700">{apt.reason}</p></div>
          </div>
        </div>

        {apt.notes && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">Clinical Notes</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{apt.notes}</p>
          </div>
        )}

        {canUpdate && isActive && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">Clinical Action Gate</h3>
            <div className="flex flex-wrap gap-3">
              {user?.role === 'doctor' && apt.status === 'in-progress' && (
                <button 
                  onClick={() => navigate(`/records/consultation/${apt._id}`)}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-extrabold rounded-xl text-sm hover:shadow-lg transition-all"
                >
                  Conduct Active EMR Consultation
                </button>
              )}
              
              {apt.status === 'booked' && (
                <>
                  <button onClick={() => updateStatus('in-progress')} disabled={updating} className="px-5 py-2.5 bg-yellow-500 text-white font-bold rounded-xl text-sm hover:bg-yellow-600 disabled:opacity-50 transition-colors">
                    Start Consultation
                  </button>
                  <button onClick={() => updateStatus('no-show')} disabled={updating} className="px-5 py-2.5 bg-gray-500 text-white font-bold rounded-xl text-sm hover:bg-gray-600 disabled:opacity-50 transition-colors">
                    Mark No Show
                  </button>
                </>
              )}
              <button onClick={() => updateStatus('cancelled')} disabled={updating} className="px-5 py-2.5 bg-danger text-white font-bold rounded-xl text-sm hover:bg-red-700 disabled:opacity-50 transition-colors">
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