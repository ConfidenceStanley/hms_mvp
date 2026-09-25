import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

const PatientFormPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'Unknown',
    maritalStatus: 'single',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalHistory: '',
    allergies: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientData = {
      fullName: form.fullName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      address: form.address,
      bloodGroup: form.bloodGroup,
      maritalStatus: form.maritalStatus,
      emergencyContact: {
        name: form.emergencyContactName,
        phone: form.emergencyContactPhone,
        relationship: form.emergencyContactRelationship
      },
      medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map(s => s.trim()) : [],
      allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : []
    };

    try {
      await API.post('/patients', patientData);
      toast.success('Patient record created successfully!');
      navigate('/patients');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-all";

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-6">Patient Admission</h2>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2 mb-4">1. Personal Particulars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} placeholder="Firstname Middlename Surname" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Marital Status</label>
                <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className={inputClass}>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Medical */}
          <div>
            <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2 mb-4">2. Contact & Medical Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Line *</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="e.g., 080XXXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="e.g., name@domain.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
                  {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Home Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} required rows="2" className={inputClass} placeholder="Full residential location..." />
            </div>
          </div>

          {/* Section 3: Next of Kin */}
          <div>
            <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2 mb-4">3. Next of Kin (Emergency Contact)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                <input type="text" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} required className={inputClass} placeholder="e.g., Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Line *</label>
                <input type="text" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} required className={inputClass} placeholder="e.g., 080XXXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Relationship *</label>
                <input type="text" name="emergencyContactRelationship" value={form.emergencyContactRelationship} onChange={handleChange} required className={inputClass} placeholder="Spouse, Sibling, etc." />
              </div>
            </div>
          </div>

          {/* Section 4: History Notes */}
          <div>
            <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2 mb-4">4. Diagnostics & Allergies (Comma Separated)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Chronic Illnesses / Medical History</label>
                <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows="2" className={inputClass} placeholder="Hypertension, Diabetes, Asthma, etc." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Allergies</label>
                <textarea name="allergies" value={form.allergies} onChange={handleChange} rows="2" className={inputClass} placeholder="Penicillin, Sulfa drugs, Peanuts, etc." />
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-5">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-sm transition-colors disabled:bg-blue-300">
              {loading ? 'Submitting...' : 'Register Profile'}
            </button>
            <button type="button" onClick={() => navigate('/patients')} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFormPage;