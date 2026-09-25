import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaFileInvoiceDollar, FaArrowUp, FaHeartbeat } from 'react-icons/fa';
import API from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pRes, dRes, aRes] = await Promise.all([
          API.get('/patients?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
          API.get('/doctors').catch(() => ({ data: { data: { doctors: [] } } })),
          API.get('/appointments/today').catch(() => ({ data: { data: { appointments: [] } } }))
        ]);
        setCounts({
          patients: pRes.data.data.pagination?.total || 0,
          doctors: dRes.data.data.doctors?.length || 0,
          appointments: aRes.data.data.appointments?.length || 0
        });
      } catch (e) {}
    };
    fetchCounts();
  }, []);

  const roleLabels = {
    admin: 'Administrator', receptionist: 'Receptionist', doctor: 'Doctor',
    nurse: 'Nurse', pharmacist: 'Pharmacist', lab_technician: 'Lab Technician',
    accountant: 'Accountant', patient: 'Patient'
  };

  const stats = [
    { label: 'Total Patients', value: counts.patients, icon: FaUserInjured, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Total Doctors', value: counts.doctors, icon: FaUserMd, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: "Today's Appointments", value: counts.appointments, icon: FaCalendarCheck, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
    { label: 'Monthly Revenue', value: formatCurrency(0), icon: FaFileInvoiceDollar, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' }
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-extrabold text-navy">Welcome back, {user?.name?.split(' ')[0]}</h2>
          <FaHeartbeat className="text-danger text-xl animate-pulse-soft" />
        </div>
        <p className="text-slate-400">{roleLabels[user?.role]} Dashboard &middot; Oronna Medical Complex</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, idx) => (
          <div key={s.label} className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-xl ${s.shadow} hover:scale-[1.02] transition-transform duration-300 animate-fadeInUp`} style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-x-4 -translate-y-4" />
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full translate-x-2 translate-y-2" />
            <div className="relative z-10">
              <s.icon className="text-2xl mb-3 opacity-90" />
              <h3 className="text-3xl font-extrabold">{s.value}</h3>
              <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaCalendarCheck className="text-2xl text-slate-300" />
        </div>
        <p className="text-slate-400 font-medium">Additional dashboard widgets will appear as data accumulates in the system.</p>
      </div>
    </div>
  );
};

export default DashboardPage;