import React from 'react';
import { Clock, MapPin, Building, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const FoodCard = ({ food, onClaim, onViewDetails }) => {
  const isVeg = food.dietType === 'veg';
  const isAvailable = food.status === 'AVAILABLE';
  const isAlmostClaimed = food.status === 'ALMOST_CLAIMED';
  const isExpired = food.status === 'EXPIRED';
  const isFullyClaimed = food.status === 'FULLY_CLAIMED';

  // Format collection deadline
  const formatDeadline = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  // Time remaining calculation
  const getTimeRemainingText = (dateStr) => {
    try {
      const now = new Date();
      const expiry = new Date(dateStr);
      const diffMs = expiry - now;
      if (diffMs <= 0) return 'Expired';
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m left`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}h ${diffMins % 60}m left`;
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md hover:border-forest-200 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Food Image with status & veg badge overlays */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-neutral-200/60">
          <div className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-sm ${
            isVeg ? 'border-emerald-600' : 'border-amber-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-amber-700'}`}></div>
          </div>
          <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              🟢 Available
            </span>
          )}
          {isAlmostClaimed && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              🟠 Almost Claimed
            </span>
          )}
          {isFullyClaimed && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm">
              🔵 Fully Claimed
            </span>
          )}
          {isExpired && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-sm">
              🔴 Expired
            </span>
          )}
        </div>

        {/* Category Pill on image */}
        <div className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
          {food.category}
        </div>

        {/* Remaining time pill */}
        {!isExpired && (
          <div className="absolute bottom-3 right-3 text-xs font-semibold text-white/95 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{getTimeRemainingText(food.expiryTime)}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 group-hover:text-forest-700 transition-colors line-clamp-1">
              {food.name}
            </h3>
            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1 font-medium">
              <Building className="w-3.5 h-3.5 text-neutral-400" />
              <span>{food.canteen}</span>
            </p>
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Details breakdown */}
          <div className="bg-neutral-50 rounded-xl p-3 space-y-2 text-xs border border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Available Quantity:</span>
              <span className={`font-bold ${
                food.quantity <= 3 ? 'text-amber-600' : 'text-forest-700'
              }`}>
                {food.quantity} {food.unit}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Collect Before:</span>
              <span className="font-semibold text-neutral-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-forest-600" />
                {formatDeadline(food.expiryTime)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 pt-1 border-t border-neutral-200/60">
              <span className="text-neutral-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                Pickup:
              </span>
              <span className="font-medium text-neutral-700 text-right truncate max-w-[170px]" title={food.pickupLocation}>
                {food.pickupLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
          <button
            onClick={() => onViewDetails(food)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 transition-colors flex items-center justify-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onClaim(food)}
            disabled={!isAvailable && !isAlmostClaimed}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
              isAvailable || isAlmostClaimed
                ? 'bg-forest-600 hover:bg-forest-700 text-white shadow-forest-900/10'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable || isAlmostClaimed ? 'Claim Now' : 'Unavailable'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
