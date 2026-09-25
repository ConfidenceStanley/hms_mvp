import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  FaPills,
  FaPlus,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBoxes
} from 'react-icons/fa';

const MedicineInventoryPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isPharmacistOrAdmin = ['admin', 'pharmacist'].includes(user?.role);

  useEffect(() => {
    fetchMedicines();
  }, [search, category, statusFilter]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (statusFilter) params.append('status', statusFilter);

      const res = await API.get(`/pharmacy?${params}`);
      setMedicines(res.data.data.medicines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Antibiotics',
    'Analgesics / Pain Relief',
    'Antimalarials',
    'Antihypertensives',
    'Antidiabetics',
    'Antihistamines',
    'Vitamins & Supplements',
    'Intravenous Fluids',
    'Topical / Dermatological'
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Dispensary & Pharmacy Stock</h2>
          <p className="text-sm text-slate-400">
            Real-time medicine inventory, pricing, and batch tracking
          </p>
        </div>
        <div className="flex gap-3">
          {isPharmacistOrAdmin && (
            <>
              <Link
                to="/pharmacy/dispense"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-success to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-success/30 transition-all text-sm"
              >
                <FaPills className="text-xs" />
                <span>Prescription Queue</span>
              </Link>
              <Link
                to="/pharmacy/add"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
              >
                <FaPlus className="text-xs" />
                <span>Add Medicine</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search brand, generic name, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary outline-none text-sm bg-slate-50/50"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl text-sm focus:border-primary outline-none bg-slate-50/50 text-slate-700 font-medium"
        >
          <option value="">All Drug Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl text-sm focus:border-primary outline-none bg-slate-50/50 text-slate-700 font-medium"
        >
          <option value="">All Stock Levels</option>
          <option value="low-stock">Low Stock Warning (≤ Reorder)</option>
          <option value="expiring">Expiring in 30 Days</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">Loading dispensary stock...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBoxes className="text-3xl text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-navy mb-1">No Pharmaceutical Products</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No medicines match your query. Add a new drug item or clear your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Code</th>
                  <th className="px-6 py-4">Drug Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  {isPharmacistOrAdmin && <th className="px-6 py-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((m) => {
                  const isLow = m.quantityInStock <= m.reorderLevel;
                  const isExpiringSoon =
                    new Date(m.expiryDate) <=
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={m._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-navy text-xs">
                        <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">
                          {m.itemCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-navy">{m.name}</p>
                        <p className="text-xs text-slate-400">
                          {m.genericName} &bull; <span className="font-semibold text-slate-600">{m.strength} ({m.dosageForm})</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {m.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-extrabold text-sm ${
                              m.quantityInStock === 0
                                ? 'text-danger'
                                : isLow
                                ? 'text-warning'
                                : 'text-success'
                            }`}
                          >
                            {m.quantityInStock} units
                          </span>
                          {isLow && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <FaExclamationTriangle /> Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-primary">
                        {formatCurrency(m.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span
                          className={`font-medium ${
                            isExpiringSoon ? 'text-danger font-bold' : 'text-slate-600'
                          }`}
                        >
                          {new Date(m.expiryDate).toLocaleDateString('en-GB')}
                        </span>
                      </td>
                      {isPharmacistOrAdmin && (
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/pharmacy/edit/${m._id}`}
                            className="inline-block px-3 py-1 bg-slate-100 hover:bg-primary hover:text-white text-navy font-bold rounded-lg transition-all text-xs"
                          >
                            Edit
                          </Link>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineInventoryPage;