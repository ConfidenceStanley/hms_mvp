import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaUserInjured, FaUserMd, FaCalendarCheck,
  FaPills, FaFileInvoiceDollar, FaFlask, FaClipboardList,
  FaUsersCog, FaChartBar, FaUserCircle, FaSignOutAlt,
  FaBars, FaTimes, FaHeart, FaPlus
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
    { path: '/appointments/book', label: 'Book Follow-up', icon: FaPlus },
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
  admin: 'Administrator', receptionist: 'Receptionist', doctor: 'Doctor',
  nurse: 'Nurse', pharmacist: 'Pharmacist', lab_technician: 'Lab Technician',
  accountant: 'Accountant', patient: 'Patient'
};

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = roleMenu[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-2.5 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/15 text-white shadow-lg shadow-white/5'
        : 'text-slate-400 hover:bg-white/8 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[270px] bg-gradient-to-b from-navy via-navy to-navy-light flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/8">
          <div className="relative">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-navy animate-pulse-soft" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-white tracking-wide">Oronna</h2>
            <p className="text-[10px] text-slate-400 font-medium">Medical Complex</p>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white p-1" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {items.map((item, idx) => (
            <NavLink key={item.path} to={item.path} className={linkClass} onClick={() => setOpen(false)} style={{ animationDelay: `${idx * 50}ms` }}>
              <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/8 py-3">
          <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
            <FaUserCircle className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>
          <button onClick={handleLogout} className="group flex items-center gap-3 px-4 py-2.5 mx-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-danger/20 hover:text-danger-light w-[calc(100%-24px)] transition-all duration-200">
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2 text-[10px] text-slate-500">
            <FaHeart className="text-danger-light animate-pulse-soft" />
            <span>Oronna Medical Complex &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[270px] flex flex-col">
        <header className="sticky top-0 z-30 glass px-6 py-3 flex items-center justify-between shadow-sm animate-fadeInDown">
          <button className="lg:hidden text-xl text-navy hover:text-primary transition-colors" onClick={() => setOpen(true)}>
            <FaBars />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-navy">{user?.name}</span>
              <span className="text-[10px] text-slate-400">{roleLabels[user?.role]}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="animate-fadeInUp">
            <Outlet />
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}
    </div>
  );
};

export default Layout;