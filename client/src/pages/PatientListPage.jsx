import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSearch, FaUserInjured, FaUserMd } from 'react-icons/fa';

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { user } = useAuth();

  const isDoctor = user?.role === 'doctor';
  const canRegister = ['admin', 'receptionist'].includes(user?.role);

  useEffect(() => {
    fetchPatients(1);
  }, [search]);

  const fetchPatients = async (pageNo) => {
    try {
      setLoading(true);
      const res = await API.get(`/patients?search=${search}&page=${pageNo}&limit=10`);
      setPatients(res.data.data.patients);
      setPagination(res.data.data.pagination);
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
            {isDoctor ? 'My Assigned Patients' : 'Patient Directory'}
          </h2>
          <p className="text-sm text-slate-400">
            {isDoctor
              ? 'Patients scheduled or consulted under your clinical care'
              : 'Complete hospital patient registry and medical files'}
          </p>
        </div>
        {canRegister && (
          <Link
            to="/patients/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            <FaPlus className="text-xs" />
            <span>Register New Patient</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={
              isDoctor
                ? 'Search your assigned patients by name, phone, or ID...'
                : 'Search all patients by name, phone number, or patient ID...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">Loading clinical records...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {isDoctor ? (
                <FaUserMd className="text-3xl text-slate-300" />
              ) : (
                <FaUserInjured className="text-3xl text-slate-300" />
              )}
            </div>
            <h3 className="text-base font-bold text-navy mb-1">
              {isDoctor ? 'No Assigned Patients Yet' : 'No Patient Records Found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isDoctor
                ? 'When patients book an appointment with you, their medical records will automatically appear in this list.'
                : 'No registered patients match your search criteria. Click "Register New Patient" to admit one.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient ID</th>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-extrabold text-navy text-xs">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">
                        {p.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{p.fullName}</p>
                      <p className="text-xs text-slate-400">
                        DOB: {new Date(p.dateOfBirth).toLocaleDateString('en-GB')}
                      </p>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600 font-medium">{p.gender}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-semibold">{p.phone}</p>
                      <p className="text-xs text-slate-400">{p.email || 'No email'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-600 font-extrabold px-2.5 py-1 rounded-lg text-xs border border-red-100">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/patients/${p._id}`}
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

        {pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchPatients(pagination.page - 1)}
              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40 text-xs font-bold transition-colors"
            >
              &larr; Previous
            </button>
            <span className="text-xs font-semibold text-slate-400">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchPatients(pagination.page + 1)}
              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40 text-xs font-bold transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientListPage;