import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaUserInjured, FaUserMd, FaCalendarCheck,
  FaPills, FaFileInvoiceDollar, FaFlask, FaClipboardList,
  FaUsersCog, FaChartBar, FaUserCircle, FaSignOutAlt,
  FaBars, FaTimes
} from 'react-icons/fa';

const roleMenu = {
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/patients', label: 'Patients', icon: FaUserInjured },
    { path: '/doctors', label: 'Doctors', icon: FaUserMd },
    { path: '/appointments', label: 'Appointments', icon: FaCalendarCheck },
    { path: '/records', label: 'Medical Records', icon: FaClipboardList },
    { path: '/pharmacy', label: 'Pharmacy', icon: FaPills },
    { path: '/lab', label: 'Laboratory', icon: FaFlask },
    { path: '/billing', label: 'Billing', icon: FaFileInvoiceDollar },
    { path: '/users', label: 'User Management', icon: FaUsersCog },
    { path: '/reports', label: 'Reports', icon: FaChartBar }
  ],
  receptionist: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/patients', label: 'Patients', icon: FaUserInjured },
    { path: '/appointments', label: 'Appointments', icon: FaCalendarCheck }
  ],
  doctor: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/appointments', label: 'My Appointments', icon: FaCalendarCheck },
    { path: '/patients', label: 'My Patients', icon: FaUserInjured },
    { path: '/records', label: 'Medical Records', icon: FaClipboardList },
    { path: '/lab', label: 'Lab Requests', icon: FaFlask }
  ],
  nurse: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/patients', label: 'Patients', icon: FaUserInjured },
    { path: '/vitals', label: 'Vital Signs', icon: FaClipboardList }
  ],
  pharmacist: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/pharmacy', label: 'Pharmacy', icon: FaPills },
    { path: '/dispense', label: 'Dispense', icon: FaPills }
  ],
  lab_technician: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/lab', label: 'Lab Tests', icon: FaFlask }
  ],
  accountant: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/billing', label: 'Billing', icon: FaFileInvoiceDollar },
    { path: '/reports', label: 'Reports', icon: FaChartBar }
  ],
  patient: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/appointments', label: 'My Appointments', icon: FaCalendarCheck },
    { path: '/records', label: 'My Records', icon: FaClipboardList },
    { path: '/billing', label: 'My Bills', icon: FaFileInvoiceDollar }
  ]
};

const roleLabels = {
  admin: 'Administrator',
  receptionist: 'Receptionist',
  doctor: 'Doctor',
  nurse: 'Nurse',
  pharmacist: 'Pharmacist',
  lab_technician: 'Lab Technician',
  accountant: 'Accountant',
  patient: 'Patient'
};

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = roleMenu[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
      isActive
        ? 'bg-white/15 text-white border-l-3 border-blue-300'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" onError={(e) => {e.target.style.display='none'}} />
            <h2 className="text-lg font-bold text-white tracking-wide">Oronna Medical Complex</h2>
        </div>
        <button className="lg:hidden text-white text-xl" onClick={() => setOpen(false)}>
            <FaTimes />
        </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass} onClick={() => setOpen(false)}>
              <item.icon className="w-5 text-center" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 py-2">
          <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
            <FaUserCircle className="w-5 text-center" />
            <span>Profile</span>
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3 text-sm text-white/70 hover:bg-red-500/30 hover:text-red-200 w-full transition-colors">
            <FaSignOutAlt className="w-5 text-center" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="sticky top-0 z-30 bg-white px-5 py-3 flex items-center justify-between shadow-sm">
          <button className="lg:hidden text-xl text-gray-600" onClick={() => setOpen(true)}>
            <FaBars />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              {roleLabels[user?.role]}
            </span>
            <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6 bg-surface">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  );
};

export default Layout;