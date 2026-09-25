import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaAmbulance, FaFlask, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const LandingPage = () => {
  const services = [
    { title: 'General Consultation', desc: 'Expert clinical diagnosis and personalized treatment by seasoned physicians.', icon: FaUserMd },
    { title: 'Emergency Services', desc: '24/7 urgent medical attention with specialized trauma response units.', icon: FaAmbulance },
    { title: 'Laboratory Services', desc: 'State-of-the-art pathology and diagnostic testing for accurate medical insights.', icon: FaFlask },
    { title: 'Pharmacy', desc: 'Fully stocked, quality-assured internal dispensary accessible around the clock.', icon: FaHospital }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Oronna Medical Complex Logo" 
                className="h-12 w-12 object-contain" 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
              <div>
                <h1 className="text-xl font-bold text-navy tracking-tight">Oronna Medical Complex</h1>
                <p className="text-xs text-primary font-semibold tracking-wider uppercase">Excellence in Healthcare</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-600 hover:text-primary font-semibold transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-primary font-semibold transition-colors">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary font-semibold transition-colors">Contact</a>
              <Link to="/login" className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                Patient Portal
              </Link>
            </nav>
            <div className="md:hidden">
              <Link to="/login" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            Primary Healthcare Provider in Ogun State
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Welcome to Oronna Medical Complex
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Providing compassionate, world-class medical services to the people of Ilaro and its environs. 
            Your health and vitality remain our utmost priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition-all shadow-md">
              Book Appointment
            </Link>
            <a href="#services" className="px-8 py-4 border-2 border-white/80 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-surface scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-navy mb-4">Our Medical Specialities</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              We leverage modern technology, clinical experience, and exceptional medical practice to deliver robust care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <s.icon className="text-3xl text-primary" />
                </div>
                <h4 className="text-lg font-bold text-navy mb-3">{s.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-wider block mb-2">Who We Are</span>
              <h3 className="text-3xl font-bold text-navy mb-6">About Oronna Medical Complex</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm lg:text-base">
                Oronna Medical Complex is a premium private healthcare facility located in the heart of Ilaro, Ogun State. 
                Founded with a strong commitment to clinical excellence, patient safety, and compassionate hospitality, 
                we ensure premium healthcare is accessible to our community.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                Our workforce consists of dedicated doctors, nursing officers, laboratory scientists, and technical support staff 
                operating within modern standards of patient safety and clinical guidelines.
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="font-extrabold text-navy text-2xl">24/7</h4>
                  <p className="text-xs text-gray-500 font-medium">Emergency Availability</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-navy text-2xl">100%</h4>
                  <p className="text-xs text-gray-500 font-medium">Regulatory Compliance</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 h-80 lg:h-96 rounded-xl flex flex-col items-center justify-center border border-gray-200 relative overflow-hidden group shadow-inner">
              <img 
                src="/hospital.png" 
                alt="Hospital Facility" 
                className="w-full h-full object-cover" 
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.nextSibling.style.display = 'block'; 
                }} 
              />
              <div className="hidden text-gray-400 font-medium text-sm">Facility Image (/hospitalImg.jpg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-navy text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Contact & Location</h3>
            <p className="text-blue-100 max-w-xl mx-auto">Get in touch with our administrative desks or locate our clinic site in Ilaro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <FaMapMarkerAlt className="text-3xl text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Our Address</h4>
              <p className="text-blue-100 text-sm text-center leading-relaxed">
                Plot 12, Oronna Road, Beside Federal Polytechnic Main Gate, Ilaro, Ogun State, Nigeria.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <FaPhone className="text-3xl text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Telephone</h4>
              <p className="text-blue-100 text-sm text-center leading-relaxed">
                +234 803 123 4567<br />
                +234 905 987 6543
              </p>
            </div>
            <div className="flex flex-col items-center bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <FaEnvelope className="text-3xl text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Email Desk</h4>
              <p className="text-blue-100 text-sm text-center leading-relaxed">
                info@oronnamedical.com<br />
                records@oronnamedical.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Oronna Medical Complex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;