import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', gender: user?.gender || 'male' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfile = async (e) => {
    e.preventDefault();
    const ok = await updateProfile(profile);
    if (ok) setEditing(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) return alert('Passwords do not match');
    const ok = await changePassword(pw.currentPassword, pw.newPassword);
    if (ok) setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const inputClass = 'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none';

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-navy">My Profile</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-navy">Personal Information</h3>
          {!editing && <button onClick={() => setEditing(true)} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">Edit</button>}
        </div>

        {editing ? (
          <form onSubmit={handleProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass + ' bg-white'}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            {[['Name', user?.name], ['Email', user?.email], ['Phone', user?.phone || 'Not set'], ['Role', user?.role], ['Gender', user?.gender], ['Address', user?.address || 'Not set']].map(([k, v]) => (
              <div key={k} className="flex border-b border-gray-100 py-2">
                <span className="w-28 font-semibold text-gray-500">{k}</span>
                <span className="text-gray-800 capitalize">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-navy mb-5">Change Password</h3>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Current Password</label>
            <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className={inputClass} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">New Password</label>
              <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className={inputClass} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm Password</label>
              <input type="password" value={pw.confirmPassword} onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} className={inputClass} required minLength={6} />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;