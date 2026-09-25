import { Link } from 'react-router-dom';
import {
  FaHospital, FaUserMd, FaAmbulance, FaFlask, FaPhone, FaMapMarkerAlt, FaEnvelope,
  FaHeartbeat, FaShieldAlt, FaAward, FaArrowRight, FaCheckCircle, FaClock,
  FaStethoscope, FaChild, FaBrain, FaWheelchair, FaStar, FaQuoteLeft, FaBars, FaTimes
} from 'react-icons/fa';
import { useState } from 'react';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    { icon: FaStethoscope, title: 'General Medicine', desc: 'Comprehensive primary healthcare and diagnostic services for all ages.', color: 'bg-blue-50 text-blue-600' },
    { icon: FaChild, title: 'Pediatrics', desc: 'Specialized care for infants, children, and adolescents by qualified pediatricians.', color: 'bg-pink-50 text-pink-600' },
    { icon: FaAmbulance, title: 'Emergency Care', desc: '24/7 emergency response team with fully equipped ambulance service.', color: 'bg-red-50 text-red-600' },
    { icon: FaFlask, title: 'Diagnostic Lab', desc: 'State-of-the-art pathology, microbiology, and imaging services.', color: 'bg-emerald-50 text-emerald-600' },
    { icon: FaBrain, title: 'Specialist Consultations', desc: 'Access to cardiologists, neurologists, gynaecologists, and more.', color: 'bg-violet-50 text-violet-600' },
    { icon: FaWheelchair, title: 'Rehabilitation', desc: 'Physiotherapy and occupational therapy for optimal recovery.', color: 'bg-amber-50 text-amber-600' }
  ];

  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '50+', label: 'Medical Specialists' },
    { value: '25,000+', label: 'Patients Served' },
    { value: '24/7', label: 'Emergency Care' }
  ];

  const testimonials = [
    {
      quote: "The staff at Oronna treated my family with such compassion. From the receptionist to Dr. Adeyemi, everyone was professional and caring. I trust them completely.",
      name: 'Mrs. Adebayo Funmi',
      role: 'Ilaro Resident',
      rating: 5
    },
    {
      quote: "I had my baby delivered here and the nursing team was incredible. Modern facility, clean environment, and truly world-class maternity care right here in Ogun State.",
      name: 'Mrs. Chinyere Okafor',
      role: 'Mother of 2',
      rating: 5
    },
    {
      quote: "When my father had a heart emergency, Oronna's response team saved his life. Fast, professional, and their cardiology unit is top-notch. Forever grateful.",
      name: 'Mr. Tunde Bakare',
      role: 'Business Owner, Sango-Ota',
      rating: 5
    }
  ];

  const whyUs = [
    { icon: FaShieldAlt, title: 'HIPAA-Compliant Records', desc: 'Your medical data is encrypted and confidential.' },
    { icon: FaAward, title: 'Certified Practitioners', desc: 'All doctors registered with MDCN Nigeria.' },
    { icon: FaClock, title: 'Rapid Response Time', desc: 'Average consultation wait time under 30 minutes.' },
    { icon: FaHeartbeat, title: 'Modern Equipment', desc: 'Investment in latest diagnostic technology.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Oronna" className="w-7 h-7 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Oronna Medical Complex</h1>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Excellence in Healthcare</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">Services</a>
              <a href="#about" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">About</a>
              <a href="#doctors" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">Our Team</a>
              <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">Testimonials</a>
              <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">Contact</a>
              <Link to="/login" className="ml-2 px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm flex items-center gap-2">
                <span>Patient Portal</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </nav>

            <button className="md:hidden text-slate-900 text-xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-3 animate-fadeInDown">
            <a href="#services" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-700 font-semibold py-2">Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-700 font-semibold py-2">About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-700 font-semibold py-2">Contact</a>
            <Link to="/login" className="block px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-center text-sm">Patient Portal</Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-20 lg:py-28">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Trusted Since 2010</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                Compassionate Care.
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                  Modern Medicine.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                At Oronna Medical Complex in Ilaro, we combine world-class clinical expertise with genuine compassion to deliver healthcare that transforms lives across Ogun State.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2 text-sm group">
                  <span>Book Appointment</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#services" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-xl hover:border-slate-900 transition-all flex items-center justify-center gap-2 text-sm">
                  <span>Explore Services</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                {stats.map((s, idx) => (
                  <div key={idx}>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-doctors.jpg"
                  alt="Oronna Medical Team"
                  className="w-full h-[500px] object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-slate-800', 'to-slate-900'); }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <FaHeartbeat className="text-2xl text-emerald-600 animate-pulse-soft" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Emergency Hotline</p>
                      <p className="text-lg font-extrabold text-slate-900">+234 803 123 4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden lg:block animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <FaShieldAlt className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Certified</p>
                    <p className="text-xs font-bold text-slate-900">MDCN Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(i => <FaStar key={i} className="text-amber-400 text-sm" />)}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">4.9/5 Patient Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4">Healthcare built on trust and excellence.</h2>
            <p className="text-slate-600 leading-relaxed">
              We invest in our people, our technology, and our processes to deliver measurably better outcomes for every patient who walks through our doors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg border border-slate-100 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="text-white text-lg" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4">Comprehensive medical services under one roof.</h2>
            <p className="text-slate-600">From routine checkups to complex specialist care, we offer end-to-end healthcare tailored to your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="text-2xl" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn More</span>
                  <FaArrowRight className="text-[10px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / STORY SECTION */}
      <section id="about" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fadeInUp">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="/about-hospital.jpg"
                    alt="Oronna Hospital Building"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <img
                    src="/about-lab.jpg"
                    alt="Diagnostic Laboratory"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="/about-consultation.jpg"
                    alt="Doctor Consultation"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <img
                    src="/about-team.jpg"
                    alt="Medical Team"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <FaAward className="text-emerald-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">15+</p>
                    <p className="text-xs text-slate-500 font-semibold">Years of Service</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-6">
                Two decades of putting patients first.
              </h2>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Founded in 2010 by <strong className="text-slate-900">Dr. Adebayo Oronna</strong>, our medical complex began as a modest 10-bed clinic on Oronna Road, Ilaro. With a vision to bring quality private healthcare to Ogun State's under-served communities, we grew steadily, one patient at a time.
                </p>
                <p>
                  Today, Oronna Medical Complex is a <strong className="text-slate-900">100-bed multi-specialty facility</strong> serving over 25,000 patients annually. We host 50+ specialists across cardiology, pediatrics, obstetrics, general surgery, and internal medicine. Our modern laboratory, well-stocked pharmacy, and 24/7 emergency response unit make us the preferred healthcare destination for families across Ilaro, Sango-Ota, Abeokuta, and beyond.
                </p>
                <p>
                  What has not changed since 2010 is our founding promise: <em className="text-slate-900 font-semibold">every patient is family</em>. We treat you the way we would want our own loved ones treated.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {['NHIS Approved', 'HMO Partners', 'ISO 9001 Certified', 'MDCN Registered'].map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-slate-700 font-semibold">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-4">Trusted by families across Ogun State.</h2>
            <p className="text-slate-400">Real stories from real patients whose lives we have had the privilege of touching.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <FaQuoteLeft className="text-emerald-400 text-2xl mb-4" />
                <p className="text-slate-200 leading-relaxed text-sm mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="text-amber-400 text-xs" />)}
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Ready to experience healthcare that cares?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you need a routine checkup or specialist consultation, our team is ready to serve you with excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:shadow-xl transition-all text-sm">
              Book Your Appointment
            </Link>
            <a href="tel:+2348031234567" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-xl hover:border-slate-900 transition-all text-sm flex items-center justify-center gap-2">
              <FaPhone className="text-xs" />
              <span>Call Emergency Hotline</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-slate-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Contact Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-4">We are here when you need us.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <FaMapMarkerAlt className="text-3xl text-emerald-400 mb-4" />
              <h3 className="font-extrabold text-white mb-3">Visit Us</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Plot 12, Oronna Road<br />
                Beside Federal Polytechnic Main Gate<br />
                Ilaro, Ogun State, Nigeria
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <FaPhone className="text-3xl text-emerald-400 mb-4" />
              <h3 className="font-extrabold text-white mb-3">Call Us</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Emergency: +234 803 123 4567<br />
                Reception: +234 905 987 6543<br />
                Ambulance: +234 802 111 2222
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <FaEnvelope className="text-3xl text-emerald-400 mb-4" />
              <h3 className="font-extrabold text-white mb-3">Email Us</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                info@oronnamedical.com<br />
                appointments@oronnamedical.com<br />
                careers@oronnamedical.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="/logo.png" alt="Oronna" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Oronna Medical Complex</p>
                <p className="text-[10px] uppercase tracking-widest">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} Oronna Medical Complex, Ilaro. All rights reserved. Licensed by MDCN Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;