import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSearch, FaUserInjured } from 'react-icons/fa';

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const { user } = useAuth();

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

  const handleSearch = (e) => setSearch(e.target.value);

  const canRegister = ['admin', 'receptionist'].includes(user?.role);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Patient Records</h2>
          <p className="text-sm text-gray-500">Search and manage clinic health records</p>
        </div>
        {canRegister && (
          <Link to="/patients/register" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all">
            <FaPlus className="text-xs" />
            <span>Register New Patient</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name, Phone Number, or Patient ID..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading records...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FaUserInjured className="text-5xl mx-auto mb-3 text-gray-300" />
            <p>No medical records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-4">Patient ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy">{p.patientId}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.fullName}</td>
                    <td className="px-6 py-4 capitalize">{p.gender}</td>
                    <td className="px-6 py-4">{p.phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded text-xs">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/patients/${p._id}`} className="text-primary font-semibold hover:text-primary-dark">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchPatients(pagination.page - 1)}
              className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchPatients(pagination.page + 1)}
              className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientListPage;