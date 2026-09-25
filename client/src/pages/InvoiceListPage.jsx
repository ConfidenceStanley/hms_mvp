import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FaFileInvoiceDollar, FaPlus, FaSearch, FaFilter, FaReceipt } from 'react-icons/fa';

const statusStyles = {
  unpaid: 'bg-red-50 text-red-700 border-red-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  refunded: 'bg-slate-100 text-slate-500 border-slate-200'
};

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const { user } = useAuth();

  const canGenerate = ['admin', 'accountant', 'receptionist'].includes(user?.role);

  useEffect(() => { fetchInvoices(1); }, [status, search]);

  const fetchInvoices = async (pageNo) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      params.append('page', pageNo);
      const res = await API.get(`/invoices?${params}`);
      setInvoices(res.data.data.invoices);
      setPagination(res.data.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Billing & Invoices</h2>
          <p className="text-sm text-slate-400">Patient billing records and payment tracking</p>
        </div>
        {canGenerate && (
          <Link to="/billing/generate" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm">
            <FaPlus className="text-xs" />
            <span>Generate Invoice</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative group flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input type="text" placeholder="Search by invoice ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary outline-none text-sm bg-slate-50/50" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 border-2 border-slate-100 rounded-xl text-sm focus:border-primary outline-none bg-slate-50/50 font-medium">
          <option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FaReceipt className="text-5xl mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-navy mb-1">No Invoices Found</h3>
            <p className="text-xs">Generate your first invoice to begin tracking revenue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-navy text-xs">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">{inv.invoiceId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{inv.patientId?.fullName}</p>
                      <p className="text-xs text-slate-400">{inv.patientId?.patientId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{new Date(inv.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4 font-extrabold text-navy">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-6 py-4 font-bold text-success">{formatCurrency(inv.amountPaid)}</td>
                    <td className="px-6 py-4 font-bold text-danger">{formatCurrency(inv.balanceDue)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusStyles[inv.paymentStatus]}`}>{inv.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/billing/${inv._id}`} className="inline-block px-4 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-navy font-bold rounded-lg transition-all text-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceListPage;