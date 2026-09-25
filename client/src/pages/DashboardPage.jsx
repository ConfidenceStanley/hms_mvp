import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import {
  FaUserInjured, FaUserMd, FaCalendarCheck, FaFileInvoiceDollar,
  FaHeartbeat, FaFlask, FaPills, FaClipboardList, FaPlus,
  FaClock, FaBoxes, FaExclamationTriangle, FaFileMedical, FaChartLine
} from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin': return <AdminDashboard user={user} />;
    case 'receptionist': return <ReceptionistDashboard user={user} />;
    case 'doctor': return <DoctorDashboard user={user} />;
    case 'nurse': return <NurseDashboard user={user} />;
    case 'pharmacist': return <PharmacistDashboard user={user} />;
    case 'lab_technician': return <LabTechDashboard user={user} />;
    case 'accountant': return <AccountantDashboard user={user} />;
    case 'patient': return <PatientDashboard user={user} />;
    default: return <GenericDashboard user={user} />;
  }
};

// Reusable stat card component
const StatCard = ({ label, value, icon: Icon, gradient, shadow, delay }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-xl ${shadow} hover:scale-[1.02] transition-transform duration-300 animate-fadeInUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-x-4 -translate-y-4" />
    <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full translate-x-2 translate-y-2" />
    <div className="relative z-10">
      <Icon className="text-2xl mb-3 opacity-90" />
      <h3 className="text-3xl font-extrabold">{value}</h3>
      <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
    </div>
  </div>
);

// Reusable welcome header
const WelcomeHeader = ({ user, subtitle }) => (
  <div className="mb-8 animate-fadeInUp">
    <div className="flex items-center gap-3 mb-1">
      <h2 className="text-3xl font-extrabold text-navy">
        Welcome back, {user?.name?.split(' ')[0]}
      </h2>
      <FaHeartbeat className="text-danger text-xl animate-pulse-soft" />
    </div>
    <p className="text-slate-400">{subtitle}</p>
  </div>
);

// Quick action card
const QuickAction = ({ to, icon: Icon, label, color, delay }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all animate-fadeInUp flex items-center gap-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-xl" />
    </div>
    <div className="flex-1">
      <p className="font-bold text-navy text-sm">{label}</p>
    </div>
    <span className="text-slate-300 group-hover:text-primary text-lg">→</span>
  </Link>
);

// ============ ADMIN DASHBOARD ============
const AdminDashboard = ({ user }) => {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, medicines: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/patients?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
      API.get('/doctors').catch(() => ({ data: { data: { doctors: [] } } })),
      API.get('/appointments/today').catch(() => ({ data: { data: { appointments: [] } } })),
      API.get('/pharmacy').catch(() => ({ data: { data: { medicines: [] } } }))
    ]).then(([p, d, a, m]) => {
      setCounts({
        patients: p.data.data.pagination?.total || 0,
        doctors: d.data.data.doctors?.length || 0,
        appointments: a.data.data.appointments?.length || 0,
        medicines: m.data.data.medicines?.length || 0
      });
    });
  }, []);

  const stats = [
    { label: 'Total Patients', value: counts.patients, icon: FaUserInjured, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Medical Practitioners', value: counts.doctors, icon: FaUserMd, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: "Today's Appointments", value: counts.appointments, icon: FaCalendarCheck, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
    { label: 'Pharmacy Items', value: counts.medicines, icon: FaPills, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' }
  ];

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Hospital Administrator Overview · Oronna Medical Complex" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, idx) => <StatCard key={s.label} {...s} delay={idx * 100} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <QuickAction to="/register" icon={FaPlus} label="Register New Staff Member" color="bg-blue-50 text-primary" delay={400} />
        <QuickAction to="/reports" icon={FaChartLine} label="View Hospital Reports" color="bg-purple-50 text-purple" delay={500} />
      </div>
    </div>
  );
};

// ============ RECEPTIONIST DASHBOARD ============
const ReceptionistDashboard = ({ user }) => {
  const [stats, setStats] = useState({ todayAppointments: 0, totalPatients: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/appointments/today').catch(() => ({ data: { data: { appointments: [] } } })),
      API.get('/patients?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
      API.get('/appointments?status=booked').catch(() => ({ data: { data: { appointments: [] } } }))
    ]).then(([today, patients, pending]) => {
      setStats({
        todayAppointments: today.data.data.appointments?.length || 0,
        totalPatients: patients.data.data.pagination?.total || 0,
        pending: pending.data.data.appointments?.length || 0
      });
    });
  }, []);

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Reception Desk · Patient Intake & Appointment Coordination" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Today's Appointments" value={stats.todayAppointments} icon={FaCalendarCheck} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={0} />
        <StatCard label="Total Registered Patients" value={stats.totalPatients} icon={FaUserInjured} gradient="from-emerald-500 to-emerald-600" shadow="shadow-emerald-500/20" delay={100} />
        <StatCard label="Pending Bookings" value={stats.pending} icon={FaClock} gradient="from-amber-500 to-orange-500" shadow="shadow-amber-500/20" delay={200} />
      </div>

      <h3 className="text-lg font-bold text-navy mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/patients/register" icon={FaPlus} label="Register New Patient" color="bg-blue-50 text-primary" delay={300} />
        <QuickAction to="/appointments/book" icon={FaCalendarCheck} label="Book Appointment" color="bg-green-50 text-success" delay={400} />
        <QuickAction to="/patients" icon={FaUserInjured} label="View Patient Directory" color="bg-purple-50 text-purple" delay={500} />
        <QuickAction to="/appointments" icon={FaClipboardList} label="Manage Appointments" color="bg-amber-50 text-warning" delay={600} />
      </div>
    </div>
  );
};

// ============ DOCTOR DASHBOARD ============
const DoctorDashboard = ({ user }) => {
  const [stats, setStats] = useState({ myAppointments: 0, todayAppointments: 0, myPatients: 0, pendingLabs: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/appointments').catch(() => ({ data: { data: { appointments: [] } } })),
      API.get('/appointments/today').catch(() => ({ data: { data: { appointments: [] } } })),
      API.get('/patients?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
      API.get('/lab?status=requested').catch(() => ({ data: { data: { tests: [] } } }))
    ]).then(([all, today, patients, labs]) => {
      setStats({
        myAppointments: all.data.data.appointments?.length || 0,
        todayAppointments: today.data.data.appointments?.length || 0,
        myPatients: patients.data.data.pagination?.total || 0,
        pendingLabs: labs.data.data.tests?.length || 0
      });
    });
  }, []);

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Physician Clinical Portal · Consultation & Diagnostics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Today's Consultations" value={stats.todayAppointments} icon={FaCalendarCheck} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={0} />
        <StatCard label="All My Appointments" value={stats.myAppointments} icon={FaClipboardList} gradient="from-emerald-500 to-emerald-600" shadow="shadow-emerald-500/20" delay={100} />
        <StatCard label="Assigned Patients" value={stats.myPatients} icon={FaUserInjured} gradient="from-violet-500 to-purple-600" shadow="shadow-violet-500/20" delay={200} />
        <StatCard label="Pending Lab Results" value={stats.pendingLabs} icon={FaFlask} gradient="from-amber-500 to-orange-500" shadow="shadow-amber-500/20" delay={300} />
      </div>

      <h3 className="text-lg font-bold text-navy mb-4">Clinical Workflow</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/appointments" icon={FaCalendarCheck} label="View My Appointments" color="bg-blue-50 text-primary" delay={400} />
        <QuickAction to="/patients" icon={FaUserInjured} label="My Assigned Patients" color="bg-green-50 text-success" delay={500} />
        <QuickAction to="/lab" icon={FaFlask} label="Track Lab Investigations" color="bg-amber-50 text-warning" delay={600} />
        <QuickAction to="/records" icon={FaFileMedical} label="Browse EMR Records" color="bg-purple-50 text-purple" delay={700} />
      </div>
    </div>
  );
};

// ============ NURSE DASHBOARD ============
const NurseDashboard = ({ user }) => {
  const [stats, setStats] = useState({ todayAppointments: 0, totalPatients: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/appointments/today').catch(() => ({ data: { data: { appointments: [] } } })),
      API.get('/patients?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } }))
    ]).then(([today, patients]) => {
      setStats({
        todayAppointments: today.data.data.appointments?.length || 0,
        totalPatients: patients.data.data.pagination?.total || 0
      });
    });
  }, []);

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Nursing Triage Desk · Vital Signs Recording" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <StatCard label="Awaiting Triage Today" value={stats.todayAppointments} icon={FaHeartbeat} gradient="from-red-500 to-pink-600" shadow="shadow-red-500/20" delay={0} />
        <StatCard label="Total Patients" value={stats.totalPatients} icon={FaUserInjured} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={100} />
      </div>

      <h3 className="text-lg font-bold text-navy mb-4">Triage Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/vitals" icon={FaHeartbeat} label="Record Patient Vitals" color="bg-red-50 text-danger" delay={200} />
        <QuickAction to="/patients" icon={FaUserInjured} label="Patient Directory" color="bg-blue-50 text-primary" delay={300} />
      </div>
    </div>
  );
};

// ============ PHARMACIST DASHBOARD ============
const PharmacistDashboard = ({ user }) => {
  const [stats, setStats] = useState({ totalMeds: 0, lowStock: 0, expiring: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/pharmacy').catch(() => ({ data: { data: { medicines: [] } } })),
      API.get('/pharmacy?status=low-stock').catch(() => ({ data: { data: { medicines: [] } } })),
      API.get('/pharmacy?status=expiring').catch(() => ({ data: { data: { medicines: [] } } })),
      API.get('/pharmacy/prescriptions/pending').catch(() => ({ data: { data: { records: [] } } }))
    ]).then(([all, low, exp, pending]) => {
      setStats({
        totalMeds: all.data.data.medicines?.length || 0,
        lowStock: low.data.data.medicines?.length || 0,
        expiring: exp.data.data.medicines?.length || 0,
        pending: pending.data.data.records?.length || 0
      });
    });
  }, []);

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Dispensary Portal · Prescription Fulfillment & Stock" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Pending Prescriptions" value={stats.pending} icon={FaPills} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={0} />
        <StatCard label="Total Medicines" value={stats.totalMeds} icon={FaBoxes} gradient="from-emerald-500 to-emerald-600" shadow="shadow-emerald-500/20" delay={100} />
        <StatCard label="Low Stock Alert" value={stats.lowStock} icon={FaExclamationTriangle} gradient="from-amber-500 to-orange-500" shadow="shadow-amber-500/20" delay={200} />
        <StatCard label="Expiring Soon" value={stats.expiring} icon={FaClock} gradient="from-red-500 to-pink-600" shadow="shadow-red-500/20" delay={300} />
      </div>

      <h3 className="text-lg font-bold text-navy mb-4">Pharmacy Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/pharmacy/dispense" icon={FaPills} label="Dispense Prescriptions" color="bg-green-50 text-success" delay={400} />
        <QuickAction to="/pharmacy" icon={FaBoxes} label="Manage Medicine Stock" color="bg-blue-50 text-primary" delay={500} />
        <QuickAction to="/pharmacy/add" icon={FaPlus} label="Add New Medicine" color="bg-purple-50 text-purple" delay={600} />
      </div>
    </div>
  );
};

// ============ LAB TECHNICIAN DASHBOARD ============
const LabTechDashboard = ({ user }) => {
  const [stats, setStats] = useState({ requested: 0, processing: 0, completed: 0, urgent: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/lab?status=requested').catch(() => ({ data: { data: { tests: [] } } })),
      API.get('/lab?status=processing').catch(() => ({ data: { data: { tests: [] } } })),
      API.get('/lab?status=completed').catch(() => ({ data: { data: { tests: [] } } })),
      API.get('/lab').catch(() => ({ data: { data: { tests: [] } } }))
    ]).then(([req, proc, comp, all]) => {
      const urgent = all.data.data.tests?.filter(t => t.priority === 'stat' || t.priority === 'urgent').length || 0;
      setStats({
        requested: req.data.data.tests?.length || 0,
        processing: proc.data.data.tests?.length || 0,
        completed: comp.data.data.tests?.length || 0,
        urgent
      });
    });
  }, []);

  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Pathology Laboratory · Diagnostic Sample Processing" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Pending Tests" value={stats.requested} icon={FaFlask} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={0} />
        <StatCard label="In Processing" value={stats.processing} icon={FaClock} gradient="from-amber-500 to-orange-500" shadow="shadow-amber-500/20" delay={100} />
        <StatCard label="Urgent / STAT" value={stats.urgent} icon={FaExclamationTriangle} gradient="from-red-500 to-pink-600" shadow="shadow-red-500/20" delay={200} />
        <StatCard label="Completed Tests" value={stats.completed} icon={FaFileMedical} gradient="from-emerald-500 to-emerald-600" shadow="shadow-emerald-500/20" delay={300} />
      </div>

      <h3 className="text-lg font-bold text-navy mb-4">Laboratory Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/lab" icon={FaFlask} label="Process Lab Investigations" color="bg-blue-50 text-primary" delay={400} />
        <QuickAction to="/patients" icon={FaUserInjured} label="Browse Patients" color="bg-purple-50 text-purple" delay={500} />
      </div>
    </div>
  );
};

// ============ ACCOUNTANT DASHBOARD ============
const AccountantDashboard = ({ user }) => {
  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Finance & Billing Desk · Hospital Revenue Management" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Monthly Revenue" value={formatCurrency(0)} icon={FaFileInvoiceDollar} gradient="from-emerald-500 to-emerald-600" shadow="shadow-emerald-500/20" delay={0} />
        <StatCard label="Pending Payments" value={formatCurrency(0)} icon={FaClock} gradient="from-amber-500 to-orange-500" shadow="shadow-amber-500/20" delay={100} />
        <StatCard label="Total Invoices" value={0} icon={FaFileMedical} gradient="from-blue-500 to-blue-600" shadow="shadow-blue-500/20" delay={200} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center animate-fadeInUp">
        <FaFileInvoiceDollar className="text-4xl text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-navy mb-1">Billing Module Coming Soon</h3>
        <p className="text-slate-400 text-sm">Invoice generation and payment tracking will be available in the next phase.</p>
      </div>
    </div>
  );
};

// ============ PATIENT DASHBOARD ============
const PatientDashboard = ({ user }) => {
  return (
    <div className="max-w-6xl">
      <WelcomeHeader user={user} subtitle="Patient Portal · Your Health at Oronna Medical Complex" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction to="/appointments" icon={FaCalendarCheck} label="My Appointments" color="bg-blue-50 text-primary" delay={100} />
        <QuickAction to="/records" icon={FaFileMedical} label="My Medical Records" color="bg-green-50 text-success" delay={200} />
      </div>

      <div className="mt-8 bg-gradient-to-br from-primary/5 to-purple/5 rounded-2xl border border-primary/10 p-8 text-center animate-fadeInUp">
        <FaHeartbeat className="text-4xl text-danger mx-auto mb-3 animate-pulse-soft" />
        <h3 className="font-bold text-navy mb-1">Your Health, Our Priority</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Access your appointments, medical records, and communicate with your healthcare providers through the patient portal.
        </p>
      </div>
    </div>
  );
};

// ============ FALLBACK ============
const GenericDashboard = ({ user }) => (
  <div className="max-w-6xl">
    <WelcomeHeader user={user} subtitle="Oronna Medical Complex" />
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
      <p className="text-slate-400">Dashboard is being configured for your role.</p>
    </div>
  </div>
);

export default DashboardPage;