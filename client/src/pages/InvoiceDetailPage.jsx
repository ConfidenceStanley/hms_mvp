import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FaArrowLeft, FaReceipt, FaCheck, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const statusStyles = {
  unpaid: 'bg-red-50 text-red-700 border-red-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-green-50 text-green-700 border-green-200'
};

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payForm, setPayForm] = useState({ amount: '', paymentMethod: 'cash', transactionReference: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canPay = ['admin', 'accountant'].includes(user?.role);

  useEffect(() => {
    API.get(`/invoices/${id}`)
      .then(r => { setInvoice(r.data.data.invoice); setPayments(r.data.data.payments); })
      .catch(() => toast.error('Invoice not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!payForm.amount || Number(payForm.amount) <= 0) return toast.error('Enter a valid amount');
    setSubmitting(true);
    try {
      const res = await API.post(`/invoices/${id}/pay`, payForm);
      toast.success(res.data.message);
      setInvoice(res.data.data.invoice);
      setShowPayForm(false);
      setPayForm({ amount: '', paymentMethod: 'cash', transactionReference: '' });
      const fresh = await API.get(`/invoices/${id}`);
      setPayments(fresh.data.data.payments);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" /></div>;
  if (!invoice) return <div className="p-12 text-center bg-white rounded-2xl"><p className="text-slate-400">Invoice not found.</p></div>;

  const inputClass = 'w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm bg-slate-50/50';

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/billing')} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><FaArrowLeft /></button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-navy">Invoice Details</h2>
          <p className="text-xs text-slate-400">{invoice.invoiceId}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${statusStyles[invoice.paymentStatus]}`}>{invoice.paymentStatus}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-extrabold">Oronna Medical Complex</h3>
              <p className="text-xs text-slate-300">Plot 12, Oronna Road, Ilaro, Ogun State</p>
              <p className="text-xs text-slate-300">+234 803 123 4567 | info@oronnamedical.com</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-widest">Invoice</p>
              <p className="text-xl font-extrabold">{invoice.invoiceId}</p>
              <p className="text-xs text-slate-300 mt-1">Date: {new Date(invoice.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between">
            <div>
              <p className="text-xs text-slate-400">Bill To</p>
              <p className="font-bold">{invoice.patientId?.fullName}</p>
              <p className="text-xs text-slate-300">{invoice.patientId?.patientId} | {invoice.patientId?.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Due Date</p>
              <p className="font-bold">{new Date(invoice.dueDate).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full text-sm mb-6">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 font-semibold text-navy">{item.description}</td>
                  <td className="px-4 py-3 text-slate-500">{item.category}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-bold text-navy">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-navy">{formatCurrency(invoice.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax</span><span className="font-bold text-navy">{formatCurrency(invoice.tax)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Discount</span><span className="font-bold text-navy">-{formatCurrency(invoice.discount)}</span></div>
              <div className="flex justify-between text-lg font-extrabold text-navy border-t-2 border-slate-900 pt-2 mt-2">
                <span>Total</span><span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-success font-bold"><span>Amount Paid</span><span>{formatCurrency(invoice.amountPaid)}</span></div>
              <div className="flex justify-between text-danger font-extrabold text-lg"><span>Balance Due</span><span>{formatCurrency(invoice.balanceDue)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {canPay && invoice.paymentStatus !== 'paid' && !showPayForm && (
        <button onClick={() => { setShowPayForm(true); setPayForm({ ...payForm, amount: invoice.balanceDue }); }} className="w-full py-3.5 bg-gradient-to-r from-success to-emerald-600 text-white font-extrabold rounded-xl hover:shadow-lg transition-all mb-6 flex items-center justify-center gap-2">
          <FaMoneyBillWave /> Record Payment
        </button>
      )}

      {showPayForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-success/20 shadow-sm mb-6 animate-scaleIn">
          <h3 className="text-sm font-bold text-navy mb-4">Record Payment</h3>
          <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Amount (₦) *</label>
              <input type="number" value={payForm.amount} onChange={(e) => setPayForm({...payForm, amount: e.target.value})} required min="1" max={invoice.balanceDue} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Method *</label>
              <select value={payForm.paymentMethod} onChange={(e) => setPayForm({...payForm, paymentMethod: e.target.value})} className={inputClass}>
                <option value="cash">Cash</option>
                <option value="card">Card (POS)</option>
                <option value="transfer">Bank Transfer</option>
                <option value="hmo">HMO</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Reference</label>
              <input type="text" value={payForm.transactionReference} onChange={(e) => setPayForm({...payForm, transactionReference: e.target.value})} placeholder="Optional" className={inputClass} />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-success text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"><FaCheck /> {submitting ? 'Processing...' : 'Confirm Payment'}</button>
              <button type="button" onClick={() => setShowPayForm(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {payments.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2"><FaReceipt className="text-primary" /><span>Payment History</span></h3>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><FaMoneyBillWave className="text-success" /></div>
                  <div>
                    <p className="font-bold text-navy">{formatCurrency(p.amount)}</p>
                    <p className="text-xs text-slate-400 capitalize">{p.paymentMethod} {p.transactionReference && `• Ref: ${p.transactionReference}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleString('en-GB')}</p>
                  <p className="text-[10px] text-slate-400">By: {p.processedBy?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;