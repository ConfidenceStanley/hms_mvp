import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaCalendarCheck, FaFilter, FaHeartbeat } from 'react-icons/fa';

const statusColors = {
  booked: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  'no-show': 'bg-slate-100 text-slate-500 border-slate-200'
};

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isDoctor = user?.role === 'doctor';
  const canBook = ['admin', 'receptionist', 'doctor'].includes(user?.role);

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

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">
            {isDoctor ? 'My Consultation Queue' : 'Appointment Roster'}
          </h2>
          <p className="text-sm text-slate-400">
            {isDoctor
              ? 'Appointments booked under your direct clinical schedule'
              : 'Hospital-wide consultation bookings and schedules'}
          </p>
        </div>
        {canBook && (
          <Link
            to="/appointments/book"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
          >
            <FaPlus className="text-xs" />
            <span>{isDoctor ? 'Book Follow-up' : 'Book Appointment'}</span>
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto text-slate-400 text-xs font-bold uppercase tracking-wider">
          <FaFilter className="text-primary" />
          <span>Filter:</span>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 border-2 border-slate-100 rounded-xl text-sm focus:border-primary outline-none bg-slate-50/50 text-slate-700 font-medium"
        >
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border-2 border-slate-100 rounded-xl text-sm focus:border-primary outline-none bg-slate-50/50 text-slate-700 font-medium"
        />
        {(status || date) && (
          <button
            onClick={() => {
              setStatus('');
              setDate('');
            }}
            className="text-xs text-danger font-bold hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">Loading clinical schedule...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarCheck className="text-3xl text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1">No Appointments Scheduled</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no appointment records matching the selected status or date filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Appointment ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  {/* <th className="px-6 py-4">Triage</th> */}
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-extrabold text-navy text-xs">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">
                        {apt.appointmentId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{apt.patientId?.fullName}</p>
                      <p className="text-xs text-slate-400">{apt.patientId?.patientId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{apt.doctorId?.userId?.name}</p>
                      <p className="text-xs text-primary font-semibold">
                        {apt.doctorId?.specialization}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(apt.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}
                    </td>

                    {/* Triage Column */}
                    {/* <td className="px-6 py-4">
                      <Link
                        to={`/appointments/${apt._id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 hover:text-primary hover:bg-blue-50 text-[11px] font-bold rounded-lg transition-colors border border-slate-200/60"
                      >
                        <FaHeartbeat className="text-primary text-xs" />
                        <span>View Vitals</span>
                      </Link>
                    </td> */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[apt.status]}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/appointments/${apt._id}`}
                        className="inline-block px-4 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-navy font-bold rounded-lg transition-all duration-200 text-xs"
                      >
                        View File
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