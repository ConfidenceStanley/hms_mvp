import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'patient', label: 'Patient' }
];

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'receptionist', gender: 'male' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(form);
    setLoading(false);
    if (ok) {
      setForm({ name: '', email: '', password: '', phone: '', role: 'receptionist', gender: 'male' });
      navigate('/users');
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-navy mb-6">Register New User</h2>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter full name" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter email" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Role *</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-blue-300">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;