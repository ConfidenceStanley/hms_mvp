import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaCloudUploadAlt, FaUserPlus, FaTimes, FaCheck } from 'react-icons/fa';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorFormPage = () => {
  const [users, setUsers] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [form, setForm] = useState({
    userId: '', specialization: '', department: '', qualifications: '',
    experience: '', bio: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });
  const [accountForm, setAccountForm] = useState({
    name: '', email: '', password: '', phone: '', gender: 'male'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctorAccounts();
  }, []);

  const loadDoctorAccounts = async () => {
    try {
      const res = await API.get('/auth/users?role=doctor&limit=100');
      const availableUsers = [];
      for (const u of res.data.data.users) {
        try {
          const check = await API.get(`/doctors?search=${u.email}`);
          const hasProfile = check.data.data.doctors.some(d => d.userId?.email === u.email);
          if (!hasProfile) availableUsers.push(u);
        } catch {
          availableUsers.push(u);
        }
      }
      setUsers(availableUsers);
    } catch (error) {
      toast.error('Failed to load doctor accounts');
    }
  };

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
      if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setAccountLoading(true);
    try {
      const res = await API.post('/auth/register', {
        ...accountForm,
        role: 'doctor'
      });
      toast.success('Doctor account created successfully');
      const newUser = res.data.data.user;
      await loadDoctorAccounts();
      setForm({ ...form, userId: newUser._id });
      setShowAccountModal(false);
      setAccountForm({ name: '', email: '', password: '', phone: '', gender: 'male' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setAccountLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error('Please select or create a doctor account first');
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
      toast.success('Doctor profile created successfully');
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

      <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FaUserPlus className="text-primary" />
        </div>
        <div className="text-sm text-slate-700">
          <p className="font-bold mb-1">Two-Step Process</p>
          <p className="text-xs text-slate-500">First, create or select a doctor login account. Then complete the professional profile with specialization, availability, and photo.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">Step 1: Login Account & Photo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor Account *</label>
                  <button type="button" onClick={() => setShowAccountModal(true)} className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                    <FaUserPlus className="text-[10px]" />
                    Create New Account
                  </button>
                </div>
                <select name="userId" value={form.userId} onChange={handleChange} required className={inputClass}>
                  <option value="">Select a doctor account</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1 italic">No available accounts. Create a new one above.</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Profile Photo</label>
                <label className="flex items-center gap-3 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <FaCloudUploadAlt className="text-xl text-slate-300" />
                  )}
                  <span className="text-sm text-slate-500 font-medium truncate">
                    {imageFile ? imageFile.name : 'Upload Image (Max 5MB)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">Step 2: Professional Details</h3>
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
                <input type="text" name="qualifications" value={form.qualifications} onChange={handleChange} className={inputClass} placeholder="MBBS, FMCP" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">Step 3: Weekly Availability</h3>
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
            <p className="text-xs text-slate-400 mt-2">Default time slots: 09:00 to 16:00 (1-hour intervals)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Professional Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" className={inputClass} placeholder="Brief professional summary..." />
          </div>

          <div className="flex gap-4 border-t border-slate-100 pt-5">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
              {loading ? 'Creating Profile...' : 'Create Doctor Profile'}
            </button>
            <button type="button" onClick={() => navigate('/doctors')} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-purple/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl">
                  <FaUserPlus className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-navy">Create Doctor Account</h3>
                  <p className="text-xs text-slate-500">Set up login credentials</p>
                </div>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Full Name *</label>
                <input type="text" required value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} placeholder="Dr. First Last" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Email *</label>
                  <input type="email" required value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} placeholder="doctor@oronna.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Phone</label>
                  <input type="text" value={accountForm.phone} onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})} placeholder="080XXXXXXXX" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Password *</label>
                  <input type="password" required minLength={6} value={accountForm.password} onChange={(e) => setAccountForm({...accountForm, password: e.target.value})} placeholder="Min 6 characters" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Gender</label>
                  <select value={accountForm.gender} onChange={(e) => setAccountForm({...accountForm, gender: e.target.value})} className={inputClass}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-warning rounded-lg p-3 text-xs text-slate-600">
                <p className="font-bold text-amber-800 mb-1">Note</p>
                <p>The doctor will use this email and password to log in. Share these credentials securely.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={accountLoading} className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {accountLoading ? 'Creating...' : <><FaCheck className="text-xs" /> Create Account</>}
                </button>
                <button type="button" onClick={() => setShowAccountModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorFormPage;