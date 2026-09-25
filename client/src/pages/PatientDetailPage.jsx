import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaUserCircle, FaArrowLeft, FaFileMedical, FaPrescription, FaHeartbeat, FaFlask, FaClock } from 'react-icons/fa';

const PatientDetailPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [emr, setEmr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get(`/patients/${id}`),
      API.get(`/records/patient/${id}`)
    ])
      .then(([pRes, eRes]) => {
        setPatient(pRes.data.data.patient);
        setEmr(eRes.data.data.records);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-400 mb-4">Patient profile not found.</p>
        <button onClick={() => navigate('/patients')} className="btn-primary inline-flex items-center gap-2">
          <FaArrowLeft /> Back to Records
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/patients')} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-xl font-bold text-navy">Clinical Electronic Health Record (EHR)</h2>
          <p className="text-xs text-slate-400">Consolidated diagnostic reports and medical history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Personal Demographics Overview Card */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center self-start">
          <FaUserCircle className="text-7xl text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy leading-tight mb-1">{patient.fullName}</h3>
          <span className="inline-block bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 rounded-full mb-5">
            {patient.patientId}
          </span>

          <div className="text-left space-y-3 pt-5 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between"><strong className="text-slate-400 font-medium">Gender:</strong><span className="capitalize">{patient.gender}</span></div>
            <div className="flex justify-between"><strong className="text-slate-400 font-medium">Mobile:</strong><span>{patient.phone}</span></div>
            <div className="flex justify-between"><strong className="text-slate-400 font-medium">Blood:</strong><span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">{patient.bloodGroup}</span></div>
            <div className="flex justify-between"><strong className="text-slate-400 font-medium">Status:</strong><span className="capitalize">{patient.maritalStatus}</span></div>
          </div>
        </div>

        {/* Right Side: Tab panel and detailed logs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'profile' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'}`}>Demographics</button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'}`}>EMR History ({emr.length})</button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-navy border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Residential Profile</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Date of Birth</p>
                    <p className="font-bold text-slate-700">{new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-medium mb-1">Residential Address</p>
                    <p className="font-bold text-slate-700 leading-relaxed">{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-navy border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Next of Kin (Emergency Dispatch)</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Full Name</p>
                    <p className="font-bold text-slate-700">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Mobile Contact</p>
                    <p className="font-bold text-slate-700">{patient.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-1">Relationship</p>
                    <p className="font-bold text-slate-700 capitalize">{patient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-navy border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Allergies & Historical Background</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium mb-2">Comorbidities & Medical History</p>
                    {patient.medicalHistory.length === 0 ? (
                      <p className="text-slate-400 italic">No historical background logged</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalHistory.map((m, idx) => (
                          <span key={idx} className="bg-blue-50 text-primary px-2.5 py-1 rounded-lg font-bold text-[10px]">{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-2">Allergies</p>
                    {patient.allergies.length === 0 ? (
                      <p className="text-slate-400 italic">No clinical allergies logged</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map((a, idx) => (
                          <span key={idx} className="bg-red-50 text-danger px-2.5 py-1 rounded-lg font-bold text-[10px]">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {emr.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
                  <FaFileMedical className="text-4xl text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No previous consultations recorded</p>
                </div>
              ) : (
                <div className="relative border-l border-slate-200 ml-4 space-y-8">
                  {emr.map((record) => (
                    <div key={record._id} className="relative pl-6 animate-fadeInUp">
                      {/* Timeline dot */}
                      <span className="absolute -left-3 top-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-100">
                        <FaClock className="text-[10px]" />
                      </span>

                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[9px] font-extrabold text-primary bg-blue-50 px-2 py-0.5 rounded-full uppercase">{record.recordId}</span>
                            <p className="text-xs text-slate-400 mt-1">Consulted by: <span className="font-bold text-slate-700">Dr. {record.doctorId?.name}</span></p>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{new Date(record.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-slate-400 font-medium block mb-1">Chief Complaint</strong>
                            <p className="text-slate-700 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{record.chiefComplaint}</p>
                          </div>
                          <div>
                            <strong className="text-slate-400 font-medium block mb-1">Clinical Assessment</strong>
                            <p className="text-slate-700 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{record.clinicalNotes}</p>
                          </div>
                        </div>

                        <div className="text-xs">
                          <strong className="text-slate-400 font-medium block mb-2">Diagnoses</strong>
                          <div className="flex flex-wrap gap-1">
                            {record.diagnosis.map((d, i) => (
                              <span key={i} className="bg-blue-50 text-primary px-2.5 py-1 rounded-lg font-bold text-[10px]">{d}</span>
                            ))}
                          </div>
                        </div>

                        {record.prescription?.length > 0 && (
                          <div className="border-t border-slate-100 pt-3">
                            <strong className="text-slate-400 font-medium block text-xs mb-2 flex items-center gap-1">
                              <FaPrescription className="text-primary" />
                              <span>Prescribed Medication</span>
                            </strong>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                                <thead className="bg-slate-50/50 text-slate-500 font-bold">
                                  <tr>
                                    <th className="px-4 py-2">Drug</th>
                                    <th className="px-4 py-2">Dosage</th>
                                    <th className="px-4 py-2">Regimen</th>
                                    <th className="px-4 py-2">Duration</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                  {record.prescription.map((p, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-2 font-bold text-navy">{p.medicineName}</td>
                                      <td className="px-4 py-2">{p.dosage}</td>
                                      <td className="px-4 py-2">{p.frequency}</td>
                                      <td className="px-4 py-2">{p.duration}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {record.linkedLabTests?.length > 0 && (
                          <div className="border-t border-slate-100 pt-3">
                            <strong className="text-slate-400 font-medium block text-xs mb-2 flex items-center gap-1">
                              <FaFlask className="text-primary" />
                              <span>Laboratory Diagnostics</span>
                            </strong>
                            <div className="space-y-2">
                              {record.linkedLabTests.map((lab, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center">
                                  <div>
                                    <p className="font-bold text-navy">{lab.testName}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{lab.status === 'completed' ? 'Completed' : 'Awaiting Processing'}</p>
                                  </div>
                                  {lab.status === 'completed' ? (
                                    <div className="text-right text-[11px] max-w-sm">
                                      <p className="text-success font-bold">Report Output:</p>
                                      <p className="text-slate-600 leading-relaxed font-semibold italic">{lab.results}</p>
                                    </div>
                                  ) : (
                                    <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase border border-amber-100">Processing</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;