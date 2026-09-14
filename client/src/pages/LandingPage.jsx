import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaAmbulance, FaFlask, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const LandingPage = () => {
  const services = [
    { title: 'General Consultation', desc: 'Expert diagnosis and treatment by qualified doctors.', icon: FaUserMd },
    { title: 'Emergency Services', desc: '24/7 emergency care and ambulance services.', icon: FaAmbulance },
    { title: 'Laboratory Tests', desc: 'Fully equipped lab for accurate diagnostic tests.', icon: FaFlask },
    { title: 'Pharmacy', desc: 'Well-stocked pharmacy with genuine medications.', icon: FaHospital }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="LifeSpring Logo" className="h-12 w-12 object-contain" onError={(e) => {e.target.style.display='none'}} />
              <div>
                <h1 className="text-xl font-bold text-navy">LifeSpring Medical Centre</h1>
                <p className="text-xs text-gray-500">Excellence in Healthcare</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-gray-600 hover:text-primary font-medium">Services</a>
              <a href="#about" className="text-gray-600 hover:text-primary font-medium">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary font-medium">Contact</a>
              <Link to="/login" className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                Patient Portal
              </Link>
            </nav>
            <div className="md:hidden">
              <Link to="/login" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-primary-dark py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Welcome to LifeSpring Medical Centre
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Providing compassionate, world-class healthcare services to Nigerians. 
            Your health is our priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 bg-white text-navy font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Book Appointment
            </Link>
            <a href="#services" className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-navy mb-4">Our Medical Services</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive healthcare services tailored to meet your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <s.icon className="text-4xl text-primary mb-4" />
                <h4 className="text-xl font-bold text-navy mb-2">{s.title}</h4>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-navy mb-6">About LifeSpring Medical Centre</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                LifeSpring Medical Centre is a leading healthcare facility dedicated to providing 
                high-quality medical services to patients across Nigeria. Established with a vision 
                to make quality healthcare accessible, we combine modern technology with compassionate care.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our team of experienced doctors, nurses, and support staff work tirelessly to ensure 
                every patient receives the best possible treatment. We specialize in general medicine, 
                pediatrics, obstetrics, and emergency care.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-navy text-2xl">15+</h4>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-navy text-2xl">50+</h4>
                  <p className="text-sm text-gray-600">Expert Doctors</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-80 lg:h-96 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Hospital Image Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
            <p className="text-blue-100">We are here to serve you 24/7</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-3xl text-primary mb-3" />
              <h4 className="font-bold mb-2">Address</h4>
              <p className="text-blue-100 text-sm">15 Health Street, Ikeja, Lagos, Nigeria</p>
            </div>
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl text-primary mb-3" />
              <h4 className="font-bold mb-2">Phone</h4>
              <p className="text-blue-100 text-sm">+234 800 LIFESPRING</p>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl text-primary mb-3" />
              <h4 className="font-bold mb-2">Email</h4>
              <p className="text-blue-100 text-sm">info@lifespringmedical.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} LifeSpring Medical Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;