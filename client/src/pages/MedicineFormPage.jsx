import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { FaPills, FaArrowLeft, FaCheck } from 'react-icons/fa';

const CATEGORIES = [
  'Antibiotics',
  'Analgesics / Pain Relief',
  'Antimalarials',
  'Antihypertensives',
  'Antidiabetics',
  'Antihistamines',
  'Vitamins & Supplements',
  'Intravenous Fluids',
  'Topical / Dermatological',
  'Other'
];

const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Suspension',
  'Injection',
  'Infusion',
  'Ointment',
  'Drops',
  'Inhaler'
];

const MedicineFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '',
    unitPrice: '',
    quantityInStock: '',
    reorderLevel: '20',
    expiryDate: '',
    batchNumber: '',
    manufacturer: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      API.get(`/pharmacy/${id}`)
        .then((res) => {
          const m = res.data.data.medicine;
          setForm({
            name: m.name,
            genericName: m.genericName,
            category: m.category,
            dosageForm: m.dosageForm,
            strength: m.strength,
            unitPrice: m.unitPrice,
            quantityInStock: m.quantityInStock,
            reorderLevel: m.reorderLevel,
            expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().split('T')[0] : '',
            batchNumber: m.batchNumber,
            manufacturer: m.manufacturer
          });
        })
        .catch(() => toast.error('Failed to load medicine details'));
    }
  }, [id, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await API.put(`/pharmacy/${id}`, form);
        toast.success('Medicine record updated');
      } else {
        await API.post('/pharmacy', form);
        toast.success('New medicine added to dispensary');
      }
      navigate('/pharmacy');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all bg-slate-50/50';

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/pharmacy')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-navy">
            {isEditing ? 'Edit Medicine Stock' : 'Add New Pharmaceutical Product'}
          </h2>
          <p className="text-xs text-slate-400">
            Dispensary inventory registration and price controls
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <FaPills className="text-primary" />
              <span>Drug Identification</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Coartem 80/480"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Generic Chemical Name *
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={form.genericName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Artemether + Lumefantrine"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Drug Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Dosage Form *
                </label>
                <select
                  name="dosageForm"
                  value={form.dosageForm}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {DOSAGE_FORMS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Strength / Concentration *
                </label>
                <input
                  type="text"
                  name="strength"
                  value={form.strength}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 500mg or 250mg/5ml"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Emzor / GSK Nigeria"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-navy border-b border-slate-100 pb-2 mb-4">
              Stock & Pricing (NGN)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Unit Price (₦) *
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 2500"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Stock Quantity in Dispensary *
                </label>
                <input
                  type="number"
                  name="quantityInStock"
                  value={form.quantityInStock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 100"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Reorder Alert Threshold
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={form.reorderLevel}
                  onChange={handleChange}
                  min="1"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Batch Number *
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., BN-2024-09"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Batch Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <FaCheck className="text-xs" />
                  <span>{isEditing ? 'Update Medicine' : 'Add to Inventory'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/pharmacy')}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineFormPage;