import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  RefreshCw,
  XCircle,
  FileCheck
} from 'lucide-react';

export const MyClaimsPage = ({ onViewPass, setActivePage }) => {
  const { user, isAuthenticated, loginDemo } = useAuth();
  const { showToast } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getMyClaims();
      setClaims(res.claims || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [isAuthenticated]);

  const handleCancelClaim = async (claimId) => {
    if (!confirm('Are you sure you want to cancel this food claim? The portions will be returned to the canteen.')) return;
    try {
      await api.updateClaimStatus(claimId, 'CANCELLED');
      showToast('Claim cancelled. Food released back to surplus list.', 'info');
      fetchClaims();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto text-3xl">
          🎟️
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-neutral-900">Sign in to view your claims</h2>
          <p className="text-xs text-neutral-500">
            Track your reserved surplus meals, active pickup passes, and eco-points history.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => loginDemo('student')}
            className="py-2.5 px-5 rounded-xl bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 shadow-sm"
          >
            Quick Login as Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              My Food Rescue Claims
            </h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Present your digital passes at the canteen pickup desks before the collection deadline.
          </p>
        </div>

        <button
          onClick={fetchClaims}
          disabled={loading}
          className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-forest-600' : ''}`} />
          <span>Refresh Claims</span>
        </button>
      </div>

      {/* Claims List or Empty State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl h-36 border border-neutral-200 animate-pulse p-6"></div>
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto text-3xl">
            🍱
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900">
              You haven't rescued any food yet. Let's save a meal!
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Explore available meals from our campus canteens, claim what you need, and earn points on the leaderboard.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('available')}
              className="py-3 px-6 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              <span>Browse Available Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {claims.map(claim => {
            const isConfirmed = claim.status === 'CONFIRMED';
            const isCollected = claim.status === 'COLLECTED';
            const isCancelled = claim.status === 'CANCELLED';
            const isExpired = claim.status === 'EXPIRED';

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-forest-200 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {claim.claimId}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isCollected
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : isCancelled
                          ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base mt-2">
                      {claim.foodName}
                    </h3>
                  </div>

                  <span className="text-sm font-extrabold text-forest-700 bg-forest-50 px-3 py-1 rounded-xl shrink-0">
                    {claim.quantity} portions
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="bg-neutral-50 rounded-xl p-3 space-y-2 text-xs border border-neutral-100">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-neutral-400" />
                      Canteen:
                    </span>
                    <span className="font-semibold text-neutral-800">{claim.canteenName}</span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Collect Before:
                    </span>
                    <span className="font-bold text-amber-900">{formatTime(claim.pickupTime)}</span>
                  </div>

                  <div className="flex items-start justify-between text-neutral-600 pt-1 border-t border-neutral-200/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      Pickup Desk:
                    </span>
                    <span className="font-medium text-neutral-700 text-right truncate max-w-[200px]" title={claim.pickupLocation}>
                      {claim.pickupLocation}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 gap-2">
                  <span className="text-[11px] text-neutral-400">
                    Claimed {new Date(claim.claimedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelClaim(claim.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 text-xs transition-colors"
                        title="Cancel claim"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onViewPass(claim)}
                      className="py-2 px-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pickup Pass</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
