import React, { useState, useEffect } from 'react';
import { FoodCard } from '../components/FoodCard';
import { api } from '../services/api';
import {
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  X,
  AlertCircle,
  PlusCircle,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AvailableFoodPage = ({ onClaimFood, onViewDetails, setActivePage }) => {
  const { isAdmin } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dietType, setDietType] = useState('all');
  const [canteen, setCanteen] = useState('All');
  const [status, setStatus] = useState('All');
  const [minQuantity, setMinQuantity] = useState('');

  // Metadata dropdown options
  const [canteenList, setCanteenList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // Fetch foods with current filters
  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (dietType !== 'all') params.dietType = dietType;
      if (canteen !== 'All') params.canteen = canteen;
      if (status !== 'All') params.status = status;
      if (minQuantity) params.minQuantity = minQuantity;

      const res = await api.getFoods(params);
      setFoods(res.foods || []);

      // Fetch metadata on initial load
      const meta = await api.getMetadata();
      if (meta.canteens) setCanteenList(meta.canteens);
      if (meta.categories) setCategoryList(meta.categories);
    } catch (err) {
      console.error('Fetch foods error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods();
    }, 200); // debounce search
    return () => clearTimeout(timer);
  }, [search, category, dietType, canteen, status, minQuantity]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDietType('all');
    setCanteen('All');
    setStatus('All');
    setMinQuantity('');
  };

  const hasActiveFilters = search || category !== 'All' || dietType !== 'all' || canteen !== 'All' || status !== 'All' || minQuantity;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Available Surplus Food
            </h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Browse campus food portions ready for immediate rescue before meal closure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFoods}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Refresh items"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-forest-600' : ''}`} />
            <span>Refresh</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActivePage('post')}
              className="py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Food</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Search & Filter Controls Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food by name, canteen, category, or ingredients..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-neutral-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-100 text-sm outline-none transition-all placeholder:text-neutral-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Food Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-neutral-50 focus:bg-white focus:border-forest-600 outline-none"
            >
              <option value="All">All Categories</option>
              {categoryList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Diet Type (Veg / Non-Veg) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Dietary Preference
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-neutral-50 focus:bg-white focus:border-forest-600 outline-none"
            >
              <option value="all">All Diets</option>
              <option value="veg">🟢 Vegetarian Only</option>
              <option value="non-veg">🔴 Non-Vegetarian</option>
            </select>
          </div>

          {/* Canteen Location */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Canteen
            </label>
            <select
              value={canteen}
              onChange={(e) => setCanteen(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-neutral-50 focus:bg-white focus:border-forest-600 outline-none"
            >
              <option value="All">All Canteens</option>
              {canteenList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Availability Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-neutral-50 focus:bg-white focus:border-forest-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="AVAILABLE">🟢 Available</option>
              <option value="ALMOST_CLAIMED">🟠 Almost Claimed</option>
              <option value="FULLY_CLAIMED">🔵 Fully Claimed</option>
              <option value="EXPIRED">🔴 Expired</option>
            </select>
          </div>

          {/* Minimum Quantity */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Min. Portions
            </label>
            <input
              type="number"
              min="1"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              placeholder="e.g. 5"
              className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-neutral-50 focus:bg-white focus:border-forest-600 outline-none"
            />
          </div>

        </div>

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <span>
              Showing filtered results ({foods.length} items found)
            </span>
            <button
              onClick={clearFilters}
              className="text-forest-700 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Food Cards Grid / Empty / Error States */}
      {error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">{error}</h3>
          <p className="text-xs text-rose-700">Please check your internet connection or server status.</p>
          <button
            onClick={fetchFoods}
            className="mt-2 py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl h-80 border border-neutral-200 animate-pulse p-4 space-y-4">
              <div className="bg-neutral-200 h-44 rounded-xl w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-10 bg-neutral-200 rounded-xl w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto text-3xl">
            🍲
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900">
              No surplus food available right now.
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Canteens typically post surplus meals near closing times (after lunch 2:30–4:00 PM and after dinner 7:30–9:30 PM).
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="py-2.5 px-5 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-800 text-xs font-bold transition-colors"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              onClaim={onClaimFood}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
