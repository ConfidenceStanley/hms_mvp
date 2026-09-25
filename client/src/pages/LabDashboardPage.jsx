import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaFlask, FaCheck, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

const statusColors = {
  requested: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-green-50 text-green-700 border-green-200'
};

const LabDashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [resultsForm, setResultsForm] = useState({ results: '', technicianNotes: '' });

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/lab?status=${filter}`);
      setRequests(res.data.data.tests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProcessing = async (id) => {
    try {
      await API.put(`/lab/${id}/status`, { status: 'processing' });
      toast.info('Test marked as processing');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmitResults = async (id) => {
    if (!resultsForm.results.trim()) return toast.error('Results field cannot be blank');
    try {
      await API.put(`/lab/${id}/results`, resultsForm);
      toast.success('Investigation results uploaded');
      setProcessingId(null);
      setResultsForm({ results: '', technicianNotes: '' });
      fetchRequests();
    } catch (err) {
      toast.error('Failed to save results');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Pathology Laboratory</h2>
          <p className="text-sm text-slate-400">Manage and complete requested laboratory investigations</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 border border-slate-100 rounded-xl shadow-sm">
          <FaFilter className="text-slate-300 ml-2 self-center" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border-0 bg-transparent text-sm font-bold text-slate-600 focus:outline-none">
            <option value="">All Investigations</option>
            <option value="requested">Pending Requests</option>
            <option value="processing">Currently Processing</option>
            <option value="completed">Completed Tests</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Synchronizing laboratory records...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FaFlask className="text-5xl mx-auto mb-3 text-slate-300 animate-pulse-soft" />
            <p className="font-bold text-navy">No diagnostic investigations found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map(test => (
              <div key={test._id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{test.testId}</span>
                    <h3 className="text-lg font-bold text-navy mt-2">{test.testName} &middot; <span className="text-slate-400 text-sm font-medium capitalize">{test.category}</span></h3>
                    <p className="text-xs text-slate-400 mt-1">Patient: <span className="font-semibold text-slate-700">{test.patientId?.fullName} ({test.patientId?.patientId})</span> &bull; Req by: <span className="font-semibold text-slate-700">Dr. {test.doctorId?.name}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.priority === 'stat' && <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1"><FaExclamationTriangle /> STAT</span>}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[test.status]}`}>{test.status}</span>
                  </div>
                </div>

                {/* Processing Inputs */}
                {test.status === 'requested' && (
                  <button onClick={() => handleStartProcessing(test._id)} className="w-fit px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:shadow-lg shadow-primary/20 transition-all">Start Diagnostics</button>
                )}

                {test.status === 'processing' && processingId !== test._id && (
                  <button onClick={() => { setProcessingId(test._id); setResultsForm({ results: '', technicianNotes: '' }); }} className="w-fit px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-xs hover:shadow-lg transition-all">Upload Findings</button>
                )}

                {processingId === test._id && (
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-4 animate-scaleIn">
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Toxicity & Diagnostic Lab Findings</h4>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Test Results *</label>
                      <textarea value={resultsForm.results} onChange={(e) => setResultsForm({ ...resultsForm, results: e.target.value })} rows="3" placeholder="Pathology findings, cell counts, qualitative/quantitative remarks..." className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none bg-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Lab Notes (Optional)</label>
                      <input type="text" value={resultsForm.technicianNotes} onChange={(e) => setResultsForm({ ...resultsForm, technicianNotes: e.target.value })} placeholder="Calibration remarks, control stats..." className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none bg-white text-sm" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleSubmitResults(test._id)} className="px-5 py-2.5 bg-success text-white font-bold rounded-xl text-xs hover:shadow-lg transition-all flex items-center gap-1"><FaCheck /> Complete Investigation</button>
                      <button onClick={() => setProcessingId(null)} className="px-5 py-2.5 bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all">Cancel</button>
                    </div>
                  </div>
                )}

                {test.status === 'completed' && (
                  <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl text-xs">
                    <p className="font-bold text-success mb-1">Diagnostic Report Output:</p>
                    <p className="text-slate-700 bg-white p-3 rounded-lg border border-green-100 mb-2 leading-relaxed">{test.results}</p>
                    {test.technicianNotes && <p className="text-slate-400"><strong>Tech Notes:</strong> {test.technicianNotes}</p>}
                    <p className="text-[10px] text-slate-400 mt-2">Validated by: Scientist {test.technicianId?.name} on {new Date(test.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabDashboardPage;