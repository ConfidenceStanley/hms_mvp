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
import VitalSignsPage from './pages/VitalSignsPage';
import MedicalRecordFormPage from './pages/MedicalRecordFormPage';
import MedicalRecordsListPage from './pages/MedicalRecordsListPage';
import LabDashboardPage from './pages/LabDashboardPage';
import MedicineInventoryPage from './pages/MedicineInventoryPage';
import MedicineFormPage from './pages/MedicineFormPage';
import PharmacyDispensePage from './pages/PharmacyDispensePage';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

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
            <Route path="/vitals" element={<ProtectedRoute allowedRoles={['admin', 'nurse']}><VitalSignsPage /></ProtectedRoute>} />
            <Route path="/records" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'patient']}><MedicalRecordsListPage /></ProtectedRoute>} />
            <Route path="/records/consultation/:appointmentId" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><MedicalRecordFormPage /></ProtectedRoute>} />
            <Route path="/lab" element={<ProtectedRoute allowedRoles={['admin', 'lab_technician', 'doctor']}><LabDashboardPage /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist', 'doctor']}><MedicineInventoryPage /></ProtectedRoute>} />
            <Route path="/pharmacy/add" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><MedicineFormPage /></ProtectedRoute>} />
            <Route path="/pharmacy/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><MedicineFormPage /></ProtectedRoute>} />
            <Route path="/pharmacy/dispense" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><PharmacyDispensePage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist', 'patient']}><InvoiceListPage /></ProtectedRoute>} />
            <Route path="/billing/generate" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist']}><InvoiceGeneratorPage /></ProtectedRoute>} />
            <Route path="/billing/:id" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist', 'patient']}><InvoiceDetailPage /></ProtectedRoute>} />
          
          
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;