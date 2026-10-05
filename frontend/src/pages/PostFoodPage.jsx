import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Clock,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'Vegetable Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Rice & Curry',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'South Indian Idli/Dosa',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Roti & Sabzi',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fried Rice & Noodles',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fruit Bowl / Healthy',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  }
];

export const PostFoodPage = ({ setActivePage }) => {
  const { user, isAdmin, loginDemo } = useAuth();
  const { showToast } = useToast();

  // Helper to get default collection deadline (e.g., 3 hours from now formatted for datetime-local)
  const getDefaultDeadline = () => {
    const d = new Date(Date.now() + 3 * 3600000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Main Course',
    quantity: '20',
    unit: 'portions',
    dietType: 'veg',
    preparationTime: '12:30 PM',
    availableFrom: new Date().toISOString().slice(0, 16),
    expiryTime: getDefaultDeadline(),
    canteen: user?.canteenName || 'Main Campus Canteen',
    pickupLocation: 'Main Canteen Counter 3, Block A',
    allergenInfo: 'Vegetarian. Dairy and gluten present.',
    image: PRESET_IMAGES[0].url
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Food name is required';
    const q = parseInt(formData.quantity, 10);
    if (isNaN(q) || q <= 0) errs.quantity = 'Please enter a valid quantity greater than 0';
    if (!formData.pickupLocation.trim()) errs.pickupLocation = 'Pickup location is required';

    if (!formData.expiryTime) {
      errs.expiryTime = 'Collection deadline is required';
    } else {
      const expDate = new Date(formData.expiryTime);
      if (expDate <= new Date()) {
        errs.expiryTime = 'Collection deadline must be in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the validation errors before submitting', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.createFood(formData);
      showToast('Surplus food posted successfully! Live on student board.', 'success');
      // Redirect to admin dashboard as requested in spec
      setActivePage('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If user is not admin, show clear authorization prompt with 1-click switch
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-900">
              Canteen Staff Authorization Required
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-md mx-auto">
              Posting surplus food requires Canteen Staff or Cafeteria Admin privileges to ensure verified kitchen food safety standards.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => loginDemo('admin')}
              className="py-3 px-6 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              <span>Switch to Canteen Staff Demo Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍲</span>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Post Surplus Food
          </h1>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          Broadcast surplus cafeteria portions to prevent food waste and nourish the campus community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
        
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 border-b border-neutral-100 pb-2">
            1. Food Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Food Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vegetable Biryani, Dal Tadka with Rice"
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.name ? 'border-rose-400 focus:ring-1 focus:ring-rose-200' : 'border-neutral-200 focus:border-forest-600'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe preparation, freshness, sides included..."
                className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 focus:border-forest-600 text-sm outline-none transition-all"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 text-sm outline-none bg-white focus:border-forest-600"
              >
                <option value="Main Course">Main Course</option>
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Breakfast / Snack">Breakfast / Snack</option>
                <option value="Dessert / Fruit">Dessert / Fruit</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Dietary Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, dietType: 'veg' }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    formData.dietType === 'veg'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Vegetarian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, dietType: 'non-veg' }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    formData.dietType === 'non-veg'
                      ? 'bg-amber-50 border-amber-600 text-amber-900'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Quantity & Units */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 border-b border-neutral-100 pb-2">
            2. Quantity & Portions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Portion Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="20"
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.quantity ? 'border-rose-400 focus:ring-1 focus:ring-rose-200' : 'border-neutral-200 focus:border-forest-600'
                }`}
              />
              {errors.quantity && <p className="text-[11px] text-rose-500 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Unit Description
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 text-sm outline-none bg-white focus:border-forest-600"
              >
                <option value="portions">portions</option>
                <option value="plates">plates</option>
                <option value="meal boxes">meal boxes</option>
                <option value="bowls">bowls</option>
                <option value="servings">servings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timelines & Pickup Location */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 border-b border-neutral-100 pb-2">
            3. Collection & Pickup Logistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Canteen Facility
              </label>
              <input
                type="text"
                name="canteen"
                value={formData.canteen}
                onChange={handleChange}
                className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Pickup Desk / Counter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="e.g. Counter 3, Block A, Science Cafeteria"
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.pickupLocation ? 'border-rose-400 focus:ring-1 focus:ring-rose-200' : 'border-neutral-200 focus:border-forest-600'
                }`}
              />
              {errors.pickupLocation && <p className="text-[11px] text-rose-500 mt-1">{errors.pickupLocation}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Available From
              </label>
              <input
                type="datetime-local"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Collection Deadline (Expiry) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleChange}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.expiryTime ? 'border-rose-400 focus:ring-1 focus:ring-rose-200' : 'border-neutral-200 focus:border-forest-600'
                }`}
              />
              {errors.expiryTime && <p className="text-[11px] text-rose-500 mt-1">{errors.expiryTime}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Allergen Information
              </label>
              <input
                type="text"
                name="allergenInfo"
                value={formData.allergenInfo}
                onChange={handleChange}
                placeholder="e.g. Contains dairy, peanuts, gluten-free, etc."
                className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
              />
            </div>
          </div>
        </div>

        {/* Image Selection Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-neutral-700">
            Select Sample Image or Custom URL
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_IMAGES.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData(p => ({ ...p, image: img.url }))}
                className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                  formData.image === img.url ? 'border-forest-600 ring-2 ring-forest-200' : 'border-neutral-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Or enter custom image URL"
            className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs outline-none focus:border-forest-600 text-neutral-600"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold shadow-md shadow-forest-900/15 transition-all flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4" />
            <span>{submitting ? 'Posting Surplus Food...' : 'POST SURPLUS FOOD'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
