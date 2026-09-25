import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { FaFileInvoiceDollar, FaArrowLeft, FaCheck, FaPlus, FaTrash } from 'react-icons/fa';

const CATEGORIES = ['Consultation', 'Medicine', 'Laboratory', 'Room Charge', 'Procedure', 'Other'];

const InvoiceGeneratorPage = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientId: '', appointmentId: '', tax: 0, discount: 0, notes: '' });
  const [items, setItems] = useState([{ description: '', category: 'Consultation', quantity: 1, unitPrice: '' }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/patients?limit=200').then(r => setPatients(r.data.data.patients)).catch(() => {});
    API.get('/appointments?status=completed').then(r => setAppointments(r.data.data.appointments)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateItem = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', category: 'Other', quantity: 1, unitPrice: '' }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice) || 0), 0);
  const total = subtotal + Number(form.tax) - Number(form.discount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId) return toast.error('Select a patient');
    const validItems = items.filter(i => i.description.trim() && i.unitPrice);
    if (validItems.length === 0) return toast.error('Add at least one billable item');

    setLoading(true);
    try {
      await API.post('/invoices', {
        patientId: form.patientId,
        appointmentId: form.appointmentId || undefined,
        items: validItems.map(i => ({ ...i, unitPrice: Number(i.unitPrice), quantity: Number(i.quantity) })),
        tax: Number(form.tax),
        discount: Number(form.discount),
        notes: form.notes
      });
      toast.success('Invoice generated successfully');
      navigate('/billing');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate invoice');
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm bg-slate-50/50';

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/billing')} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><FaArrowLeft /></button>
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Generate Invoice</h2>
          <p className="text-xs text-slate-400">Create a billing record for patient services</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">Patient & Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Patient *</label>
              <select name="patientId" value={form.patientId} onChange={handleChange} required className={inputClass}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.patientId} - {p.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Appointment (Optional)</label>
              <select name="appointmentId" value={form.appointmentId} onChange={handleChange} className={inputClass}>
                <option value="">None</option>
                {appointments.map(a => <option key={a._id} value={a._id}>{a.appointmentId} - {a.patientId?.fullName}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2"><FaFileInvoiceDollar className="text-primary" /><span>Billable Items</span></h3>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Description</label>
                  <input type="text" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="e.g., Consultation Fee" className={inputClass} />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Category</label>
                  <select value={item.category} onChange={(e) => updateItem(idx, 'category', e.target.value)} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-3 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Qty</label>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Unit Price (₦)</label>
                  <input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <p className="text-xs text-slate-400 mb-1">Total</p>
                  <p className="font-extrabold text-navy">{formatCurrency(item.quantity * item.unitPrice || 0)}</p>
                </div>
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItem(idx)} className="p-2 text-danger hover:bg-red-50 rounded-lg"><FaTrash className="text-xs" /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1"><FaPlus /> Add Line Item</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tax (₦)</label>
              <input type="number" name="tax" value={form.tax} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Discount (₦)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Notes</label>
              <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional" className={inputClass} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Subtotal: {formatCurrency(subtotal)}</p>
              <p className="text-xs text-slate-400">Tax: {formatCurrency(form.tax)} | Discount: {formatCurrency(form.discount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Grand Total</p>
              <p className="text-3xl font-extrabold text-navy">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? 'Generating...' : <><FaCheck className="text-xs" /> Generate Invoice</>}
          </button>
          <button type="button" onClick={() => navigate('/billing')} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceGeneratorPage;