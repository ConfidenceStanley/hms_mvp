import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt, FaHeartbeat, FaUserMd } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT PANEL: Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse-soft" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fadeInDown">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
              <img src="/logo.png" alt="Oronna" className="w-9 h-9 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Oronna</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Medical Complex</p>
            </div>
          </div>

          {/* Middle Content */}
          <div className="space-y-8 animate-fadeInUp">
            <div>
              <h2 className="text-5xl font-extrabold leading-tight mb-4">
                Excellence in <br />
                <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Medical Care.
                </span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-md">
                Nigeria's premier healthcare management platform, integrating clinical excellence with modern technology since 2010.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                <FaHeartbeat className="text-red-400 text-2xl mb-2 animate-pulse-soft" />
                <p className="text-xs font-bold text-white">24/7 Emergency</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Round-the-clock care</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                <FaUserMd className="text-blue-400 text-2xl mb-2" />
                <p className="text-xs font-bold text-white">Expert Team</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Certified specialists</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                <FaShieldAlt className="text-emerald-400 text-2xl mb-2" />
                <p className="text-xs font-bold text-white">HIPAA Secure</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Encrypted patient data</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 mb-2 rounded-md bg-teal-400/20 flex items-center justify-center">
                  <span className="text-teal-400 font-bold text-sm">15+</span>
                </div>
                <p className="text-xs font-bold text-white">Years Trust</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Serving Ogun State</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-slate-500 animate-fadeInUp">
            <p>© {new Date().getFullYear()} Oronna Medical Complex, Ilaro, Ogun State</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">
        <div className="absolute top-6 right-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1">
            <span>← Back to Website</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
              <img src="/logo.png" alt="Oronna" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">Oronna</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Medical Complex</p>
            </div>
          </div>

          <div className="animate-fadeInUp">
            <div className="inline-block mb-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                Secure Login
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-8">
              Sign in to access your clinical workspace and manage patient care.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <label className="block text-xs font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@oronnamedical.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm text-slate-900 placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button type="button" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors text-sm" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm text-slate-900 placeholder-slate-400"
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="animate-fadeInUp flex items-center gap-2" style={{ animationDelay: '0.25s' }}>
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium">Keep me signed in on this device</label>
            </div>

            <div className="animate-fadeInUp pt-2" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-slate-400 text-center">
              Protected by <strong className="text-slate-600">HIPAA-compliant</strong> encryption. All access is monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;