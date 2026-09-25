import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaCalendarCheck } from 'react-icons/fa';

const statusColors = {
  booked: 'bg-blue-50 text-blue-700',
  'in-progress': 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  'no-show': 'bg-gray-100 text-gray-500'
};

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, [status, date]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (date) params.append('date', date);
      const res = await API.get(`/appointments?${params}`);
      setAppointments(res.data.data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canBook = ['admin', 'receptionist'].includes(user?.role);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Appointments</h2>
          <p className="text-sm text-gray-500">Manage clinical schedules and consultations</p>
        </div>
        {canBook && (
          <Link to="/appointments/book" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
            <FaPlus className="text-xs" />
            <span>Book Appointment</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 flex flex-col sm:flex-row gap-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
        {(status || date) && (
          <button onClick={() => { setStatus(''); setDate(''); }} className="text-sm text-red-500 font-semibold hover:underline">Clear Filters</button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FaCalendarCheck className="text-5xl mx-auto mb-3 text-gray-300" />
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-4">Appointment ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy text-xs">{apt.appointmentId}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{apt.patientId?.fullName}</p>
                      <p className="text-xs text-gray-400">{apt.patientId?.patientId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{apt.doctorId?.userId?.name}</p>
                      <p className="text-xs text-primary">{apt.doctorId?.specialization}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(apt.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/appointments/${apt._id}`} className="text-primary font-semibold hover:text-primary-dark text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentListPage;