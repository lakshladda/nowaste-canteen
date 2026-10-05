import React from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Building,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const FoodDetailsPage = ({ food, onBack, onClaim }) => {
  if (!food) return null;

  const isVeg = food.dietType === 'veg';
  const isAvailable = food.status === 'AVAILABLE' || food.status === 'ALMOST_CLAIMED';

  const formatDateTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + d.toLocaleDateString() + ')';
    } catch {
      return dateStr;
    }
  };

  const formatRelativeTime = (dateStr) => {
    try {
      const now = new Date();
      const expiry = new Date(dateStr);
      const diffMs = expiry - now;
      if (diffMs <= 0) return 'Expired';
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins} minutes left`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hours ${diffMins % 60} mins left`;
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Available Food</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        
        {/* Large Food Image with Hero Banner */}
        <div className="relative h-72 sm:h-96 w-full bg-neutral-100 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Diet & Status Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm">
              <div className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-sm ${
                isVeg ? 'border-emerald-600' : 'border-amber-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-amber-700'}`}></div>
              </div>
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-xl">
              {food.category}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold text-white shadow-sm ${
              food.status === 'AVAILABLE'
                ? 'bg-emerald-500'
                : food.status === 'ALMOST_CLAIMED'
                ? 'bg-amber-500'
                : food.status === 'FULLY_CLAIMED'
                ? 'bg-blue-600'
                : 'bg-rose-600'
            }`}>
              {food.status === 'AVAILABLE' && '🟢 Available'}
              {food.status === 'ALMOST_CLAIMED' && '🟠 Almost Claimed'}
              {food.status === 'FULLY_CLAIMED' && '🔵 Fully Claimed'}
              {food.status === 'EXPIRED' && '🔴 Expired'}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-forest-200 font-semibold mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>{food.canteen}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              {food.name}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Prominent Expiry Warning Banner as requested */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm">Collection Deadline Reminder</h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Please collect the food before the collection deadline. Surplus cafeteria items that are not collected before the deadline are composted according to campus food safety protocols.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Description & Preparation
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Metric Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 block">
                Remaining Quantity
              </span>
              <p className="text-2xl font-black text-forest-950 mt-1">
                {food.quantity}
              </p>
              <span className="text-xs text-forest-700">{food.unit}</span>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Original Batch
              </span>
              <p className="text-2xl font-black text-neutral-800 mt-1">
                {food.originalQuantity || food.quantity}
              </p>
              <span className="text-xs text-neutral-500">{food.unit}</span>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Posted At
              </span>
              <p className="text-sm font-bold text-neutral-800 mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{new Date(food.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
              <span className="text-[11px] text-neutral-500">Today</span>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Collect Deadline
              </span>
              <p className="text-sm font-bold text-amber-950 mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatDateTime(food.expiryTime)}</span>
              </p>
              <span className="text-[11px] font-semibold text-amber-700">
                {formatRelativeTime(food.expiryTime)}
              </span>
            </div>

          </div>

          {/* Location & Allergen Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Pickup Location</span>
              </span>
              <p className="text-sm font-semibold text-neutral-800">
                {food.pickupLocation}
              </p>
              <p className="text-xs text-neutral-500">
                Canteen: {food.canteen}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Allergen & Dietary Information</span>
              </span>
              <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                {food.allergenInfo || 'Standard ingredients. No specific allergens reported.'}
              </p>
            </div>

          </div>

          {/* Claim Action Bar */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="text-xs text-neutral-500">
                Rescuing surplus food earns <strong className="text-forest-700">10 points per portion</strong>
              </p>
              <p className="text-xs font-semibold text-neutral-800">
                Status: {food.status.replace('_', ' ')}
              </p>
            </div>

            <button
              onClick={() => onClaim(food)}
              disabled={!isAvailable}
              className={`w-full sm:w-auto py-3.5 px-8 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-forest-600 hover:bg-forest-700 text-white shadow-forest-900/15'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Claim Surplus Food Now' : 'Food No Longer Available'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
