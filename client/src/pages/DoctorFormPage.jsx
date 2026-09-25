import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaCloudUploadAlt } from 'react-icons/fa';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorFormPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: '', specialization: '', department: '', qualifications: '',
    experience: '', bio: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/auth/users?role=doctor')
      .then((res) => setUsers(res.data.data.users))
      .catch(() => toast.error('Failed to load doctor user accounts'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    const days = form.availableDays.includes(day)
      ? form.availableDays.filter((d) => d !== day)
      : [...form.availableDays, day];
    setForm({ ...form, availableDays: days });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error('Select a user account');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', form.userId);
      formData.append('specialization', form.specialization);
      formData.append('department', form.department);
      formData.append('qualifications', form.qualifications);
      formData.append('experience', form.experience);
      formData.append('bio', form.bio);
      form.availableDays.forEach((d) => formData.append('availableDays', d));
      if (imageFile) formData.append('profileImage', imageFile);

      await API.post('/doctors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Doctor profile created');
      navigate('/doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all bg-slate-50/50';

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-extrabold text-navy mb-6">Add Medical Practitioner</h2>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">1. Account & Photo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">User Account *</label>
                <select name="userId" value={form.userId} onChange={handleChange} required className={inputClass}>
                  <option value="">Choose a doctor account</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Profile Photo</label>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <FaCloudUploadAlt className="text-xl text-slate-300" />
                  )}
                  <span className="text-sm text-slate-500 font-medium">
                    {imageFile ? imageFile.name : 'Upload Image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">2. Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Specialization *</label>
                <input type="text" name="specialization" value={form.specialization} onChange={handleChange} required className={inputClass} placeholder="e.g., General Medicine" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} className={inputClass} placeholder="e.g., Surgery, Pediatrics" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Experience (Years)</label>
                <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Qualifications (comma separated)</label>
                <input type="text" name="qualifications" value={form.qualifications} onChange={handleChange} className={inputClass} placeholder="MBBS, FMCP, FWACS" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">3. Weekly Availability</h3>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    form.availableDays.includes(day)
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/20'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Professional Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" className={inputClass} placeholder="Brief professional summary..." />
          </div>

          <div className="flex gap-4 border-t border-slate-100 pt-5">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
            <button type="button" onClick={() => navigate('/doctors')} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormPage;