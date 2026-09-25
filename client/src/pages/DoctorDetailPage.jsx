import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaArrowLeft, FaUserMd, FaPhone, FaEnvelope, FaGraduationCap, FaClock, FaCalendarAlt } from 'react-icons/fa';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/doctors/${id}`)
      .then((r) => setDoctor(r.data.data.doctor))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center animate-fadeInUp">
        <p className="text-slate-400 mb-4">Doctor profile not found.</p>
        <button onClick={() => navigate('/doctors')} className="text-primary font-bold hover:underline">Back to list</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <button onClick={() => navigate('/doctors')} className="flex items-center gap-2 text-slate-400 hover:text-primary font-medium mb-6 transition-colors">
        <FaArrowLeft className="text-sm" />
        <span>Back to Practitioners</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="relative h-56 bg-gradient-to-br from-primary via-primary-dark to-purple flex items-end p-6">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold">
            {doctor.employeeId}
          </div>
          <div className="relative z-10 flex items-end gap-5">
            <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
              {doctor.profileImage ? (
                <img src={doctor.profileImage} alt={doctor.userId?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white text-4xl font-extrabold">
                  {doctor.userId?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-extrabold text-white">{doctor.userId?.name}</h1>
              <p className="text-blue-200 font-bold">{doctor.specialization}</p>
              <p className="text-blue-300 text-sm">{doctor.department || 'General'} Department</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors">
              <FaClock className="text-primary text-lg" />
              <div>
                <p className="text-xs text-slate-400">Experience</p>
                <p className="font-bold text-navy">{doctor.experience} Years</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors">
              <FaPhone className="text-primary text-lg" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-bold text-navy">{doctor.userId?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors">
              <FaEnvelope className="text-primary text-lg" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-bold text-navy text-sm">{doctor.userId?.email}</p>
              </div>
            </div>
          </div>

          {doctor.bio && (
            <div className="animate-fadeInUp">
              <h3 className="text-sm font-bold text-navy mb-2">About</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          <div className="animate-fadeInUp">
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <FaGraduationCap className="text-primary" />
              <span>Qualifications</span>
            </h3>
            {doctor.qualifications?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {doctor.qualifications.map((q, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 text-primary font-bold text-xs rounded-lg">{q}</span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">No qualifications listed</p>
            )}
          </div>

          <div className="animate-fadeInUp">
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              <span>Weekly Availability</span>
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <span key={day} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  doctor.availableDays?.includes(day)
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-slate-50 text-slate-300'
                }`}>
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>
            {doctor.availableSlots?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Time Slots</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.map((slot, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary font-bold text-xs rounded-lg border border-primary/10">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;