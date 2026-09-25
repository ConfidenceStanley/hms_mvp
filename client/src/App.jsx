import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PatientListPage from './pages/PatientListPage';
import PatientFormPage from './pages/PatientFormPage';
import PatientDetailPage from './pages/PatientDetailPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorFormPage from './pages/DoctorFormPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AppointmentListPage from './pages/AppointmentListPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';

// Phase 5 Clinical Pages
import VitalSignsPage from './pages/VitalSignsPage';
import MedicalRecordFormPage from './pages/MedicalRecordFormPage';
import LabDashboardPage from './pages/LabDashboardPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<ProtectedRoute allowedRoles={['admin']}><RegisterPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor', 'nurse']}><PatientListPage /></ProtectedRoute>} />
            <Route path="/patients/register" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><PatientFormPage /></ProtectedRoute>} />
            <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor', 'nurse']}><PatientDetailPage /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><DoctorListPage /></ProtectedRoute>} />
            <Route path="/doctors/add" element={<ProtectedRoute allowedRoles={['admin']}><DoctorFormPage /></ProtectedRoute>} />
            <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetailPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><AppointmentListPage /></ProtectedRoute>} />
            <Route path="/appointments/book" element={<ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}><AppointmentBookingPage /></ProtectedRoute>} />
            <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetailPage /></ProtectedRoute>} />
            
            {/* Phase 5 Routes */}
            <Route path="/vitals" element={<ProtectedRoute allowedRoles={['admin', 'nurse']}><VitalSignsPage /></ProtectedRoute>} />
            <Route path="/records/consultation/:appointmentId" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><MedicalRecordFormPage /></ProtectedRoute>} />
            <Route path="/lab" element={<ProtectedRoute allowedRoles={['admin', 'lab_technician', 'doctor']}><LabDashboardPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;