import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaFileInvoiceDollar } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();

  const roleLabels = {
    admin: 'Administrator', receptionist: 'Receptionist', doctor: 'Doctor',
    nurse: 'Nurse', pharmacist: 'Pharmacist', lab_technician: 'Lab Technician',
    accountant: 'Accountant', patient: 'Patient'
  };

  const stats = [
    { label: 'Total Patients', value: '0', icon: FaUserInjured, color: 'text-primary bg-blue-50' },
    { label: 'Total Doctors', value: '0', icon: FaUserMd, color: 'text-success bg-green-50' },
    { label: "Today's Appointments", value: '0', icon: FaCalendarCheck, color: 'text-warning bg-orange-50' },
    { label: 'Monthly Revenue', value: formatCurrency(0), icon: FaFileInvoiceDollar, color: 'text-purple bg-purple-50' }
  ];

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold text-navy">Welcome, {user?.name}</h2>
      <p className="text-gray-500 mb-6">Role: {roleLabels[user?.role]}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        <p>Dashboard statistics will populate as data is added to the system.</p>
      </div>
    </div>
  );
};

export default DashboardPage;