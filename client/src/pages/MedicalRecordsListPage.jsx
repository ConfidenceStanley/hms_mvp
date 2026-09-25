import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaFileMedical, FaSearch, FaUserInjured, FaCalendarAlt } from 'react-icons/fa';

const MedicalRecordsListPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/patients?search=${search}&limit=50`);
      setPatients(res.data.data.patients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">Electronic Medical Records (EMR)</h2>
        <p className="text-sm text-slate-400">
          {isDoctor
            ? 'Access EMR history of patients under your clinical care'
            : 'Browse patient clinical files and diagnostic history'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search patient by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Loading clinical files...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileMedical className="text-3xl text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-navy mb-1">No Patient Files Found</h3>
          <p className="text-xs text-slate-400">
            {isDoctor
              ? 'You have no assigned patients yet.'
              : 'No patients match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => (
            <Link
              key={p._id}
              to={`/patients/${p._id}`}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group animate-fadeInUp"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-extrabold text-base shadow-md">
                  {p.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy truncate group-hover:text-primary transition-colors">
                    {p.fullName}
                  </p>
                  <p className="text-xs text-primary font-semibold">{p.patientId}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaUserInjured className="text-slate-300" />
                  <span className="capitalize">{p.gender}</span>
                  <span className="text-slate-300">•</span>
                  <span className="bg-red-50 text-danger font-bold px-1.5 py-0.5 rounded text-[10px]">
                    {p.bloodGroup}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FaCalendarAlt className="text-slate-300" />
                  <span>Registered {new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">View EMR History</span>
                <span className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsListPage;