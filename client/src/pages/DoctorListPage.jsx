import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaUserMd, FaSearch, FaClock, FaGraduationCap } from 'react-icons/fa';
import { getImageUrl } from '../utils/getImageUrl';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/doctors?search=${search}`);
      setDoctors(res.data.data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fadeInUp">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Medical Practitioners</h2>
          <p className="text-sm text-slate-400">Registered doctors at Oronna Medical Complex</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/doctors/add" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
            <FaPlus className="text-xs" />
            <span>Add Doctor</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by doctor name, specialization, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 h-72 shimmer-bg" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 animate-fadeInUp">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-3xl text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">No medical practitioners found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, idx) => (
            <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="relative h-48 bg-gradient-to-br from-primary/5 to-purple/5 flex items-center justify-center overflow-hidden">
                {doc.profileImage ? (
                  <img src={getImageUrl(doc.profileImage)} alt={doc.userId?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
                    {doc.userId?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft" />
                  <span className="text-[10px] font-bold text-success">Active</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-extrabold text-navy mb-0.5 group-hover:text-primary transition-colors">{doc.userId?.name}</h3>
                <p className="text-primary font-bold text-sm mb-3">{doc.specialization}</p>
                <div className="space-y-2 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-slate-300" />
                    <span>{doc.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-slate-300" />
                    <span>{doc.qualifications?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserMd className="text-slate-300" />
                    <span>{doc.department || 'General'} Department</span>
                  </div>
                </div>
                <Link to={`/doctors/${doc._id}`} className="block text-center py-2.5 bg-gradient-to-r from-slate-50 to-blue-50 text-primary font-bold rounded-xl hover:from-primary hover:to-primary-dark hover:text-white transition-all duration-300 text-sm">
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;