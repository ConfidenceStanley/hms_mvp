import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaUserCircle, FaArrowLeft, FaFileMedical } from 'react-icons/fa';

const PatientDetailPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/patients/${id}`)
      .then(res => setPatient(res.data.data.patient))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-xl">
        <p className="text-gray-500 mb-4">Patient profile not found.</p>
        <button onClick={() => navigate('/patients')} className="btn-primary inline-flex items-center gap-2">
          <FaArrowLeft /> Back to Records
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/patients')} className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm">
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-xl font-bold text-navy">Patient Health Record</h2>
          <p className="text-xs text-gray-500">Overview of medical statistics and personal data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Basic Card */}
        <div className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-xl shadow-sm text-center">
          <FaUserCircle className="text-7xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy mb-1">{patient.fullName}</h3>
          <span className="inline-block bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full mb-4">
            {patient.patientId}
          </span>

          <div className="text-left space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div><strong>Gender:</strong> <span className="capitalize">{patient.gender}</span></div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>Email:</strong> {patient.email || 'None'}</div>
            <div><strong>Blood Group:</strong> <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">{patient.bloodGroup}</span></div>
          </div>
        </div>

        {/* Right Side: Detailed Sections */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">1. Residential & Personal</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium mb-1">Marital Status</p>
                <p className="font-semibold text-gray-800 capitalize">{patient.maritalStatus}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-800">{new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 font-medium mb-1">Home Address</p>
                <p className="font-semibold text-gray-800 leading-relaxed">{patient.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">2. Emergency (Next of Kin)</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">Phone Line</p>
                <p className="font-semibold text-gray-800">{patient.emergencyContact.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">Relationship</p>
                <p className="font-semibold text-gray-800 capitalize">{patient.emergencyContact.relationship}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4">3. Clinical History Summary</h4>
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium mb-2">Pre-existing Medical Conditions</p>
                {patient.medicalHistory.length === 0 ? (
                  <p className="text-gray-500 italic">No chronic illnesses recorded</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {patient.medicalHistory.map((m, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded">{m}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-2">Known Drug/Food Allergies</p>
                {patient.allergies.length === 0 ? (
                  <p className="text-gray-500 italic">No drug or food allergies logged</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {patient.allergies.map((a, idx) => (
                      <span key={idx} className="bg-red-50 text-red-700 font-medium px-2 py-1 rounded">{a}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;