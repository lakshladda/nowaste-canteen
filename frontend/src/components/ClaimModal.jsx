import React, { useState } from 'react';
import { X, AlertCircle, Sparkles, Clock, MapPin, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ClaimModal = ({ food, isOpen, onClose, onClaimSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { refreshUser } = useAuth();

  if (!isOpen || !food) return null;

  const maxAllowed = Math.min(food.quantity, 6); // standard student claim limit per transaction

  const handleIncrement = () => {
    if (quantity < food.quantity && quantity < maxAllowed) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.claimFood(food.id, quantity);
      
      // Celebrate with eco green/gold confetti!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#16a34a', '#22c55e', '#cf8d2a', '#eab308']
      });

      showToast(`Food successfully claimed! Earned +${result.pointsEarned || (quantity * 10)} pts! 🌱`, 'success');
      showToast('Your pickup pass is ready.', 'info');
      
      if (refreshUser) refreshUser();
      
      onClaimSuccess(result.claim, result.updatedFood);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDeadline = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-forest-50/50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-sm">
              🍱
            </span>
            <h3 className="font-bold text-neutral-900 text-base">Confirm Surplus Food Claim</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex items-start gap-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <img
              src={food.image}
              alt={food.name}
              className="w-16 h-16 object-cover rounded-lg shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-neutral-900">{food.name}</h4>
              <p className="text-xs text-neutral-500">{food.canteen}</p>
              <p className="text-xs font-semibold text-forest-700">
                {food.quantity} {food.unit} remaining
              </p>
            </div>
          </div>

          {/* Portion selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Select Portions to Rescue
            </label>
            <div className="flex items-center justify-between p-2 rounded-xl border border-neutral-200 bg-white">
              <span className="text-sm font-semibold text-neutral-700 pl-3">
                Portions:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-extrabold text-lg text-forest-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= food.quantity || quantity >= maxAllowed}
                  className="w-9 h-9 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-800 font-bold flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              You are claiming <span className="font-bold text-neutral-800">{quantity} {food.unit}</span> of {food.name}.
            </p>
          </div>

          {/* Notice & Gamification points preview */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs text-amber-950">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Earn +{quantity * 10} Food Saver Points upon confirmation!</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-800">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Must collect before: <strong>{formatDeadline(food.expiryTime)}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-800">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Pickup at: <strong>{food.pickupLocation}</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="py-3 px-4 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-4 rounded-xl text-sm font-bold text-white bg-forest-600 hover:bg-forest-700 transition-all shadow-md shadow-forest-900/10 flex items-center justify-center gap-2"
            >
              {submitting ? 'Claiming...' : 'Confirm Claim'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
