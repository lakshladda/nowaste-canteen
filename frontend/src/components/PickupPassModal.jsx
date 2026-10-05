import React from 'react';
import { X, CheckCircle, Printer, Download, Clock, MapPin, Building, ShieldCheck, QrCode } from 'lucide-react';

export const PickupPassModal = ({ claim, isOpen, onClose }) => {
  if (!isOpen || !claim) return null;

  const formatDeadline = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden animate-scale-up">
        
        {/* Pass Top Banner */}
        <div className="bg-forest-800 text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <span className="text-9xl">🌱</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-200">
                Official Campus Rescue Pass
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white uppercase">
            FOOD RESCUE PASS
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-forest-50">
              {claim.claimId}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-forest-950">
              <CheckCircle className="w-3 h-3" />
              CONFIRMED
            </span>
          </div>
        </div>

        {/* Ticket Perforation Notch visual */}
        <div className="relative flex items-center justify-between px-2 bg-white">
          <div className="w-5 h-5 rounded-full bg-black/60 -ml-5"></div>
          <div className="flex-1 border-t-2 border-dashed border-neutral-200 my-2"></div>
          <div className="w-5 h-5 rounded-full bg-black/60 -mr-5"></div>
        </div>

        {/* Pass Details Body */}
        <div className="p-6 space-y-5">
          
          <div className="grid grid-cols-2 gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Food Item
              </span>
              <h4 className="font-bold text-neutral-900 text-sm mt-0.5">
                {claim.foodName}
              </h4>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Reserved Quantity
              </span>
              <p className="font-extrabold text-forest-700 text-base mt-0.5">
                {claim.quantity} {claim.unit || 'portions'}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Canteen
              </span>
              <p className="font-semibold text-neutral-800 text-xs mt-0.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                <span>{claim.canteenName}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Collect Before
              </span>
              <p className="font-bold text-amber-700 text-xs mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatDeadline(claim.pickupTime)}</span>
              </p>
            </div>

            <div className="col-span-2 pt-2 border-t border-cream-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Pickup Desk Location
              </span>
              <p className="font-medium text-neutral-800 text-xs mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{claim.pickupLocation}</span>
              </p>
            </div>
          </div>

          {/* QR Code Graphic Verification */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 text-white shadow-inner">
            <div className="w-20 h-20 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center">
              {/* SVG QR Code Simulation */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 fill-current">
                {/* QR Positioning patterns */}
                <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                <rect x="5" y="5" width="20" height="20" fill="white"/>
                <rect x="10" y="10" width="10" height="10" fill="currentColor"/>

                <rect x="70" y="0" width="30" height="30" fill="currentColor"/>
                <rect x="75" y="5" width="20" height="20" fill="white"/>
                <rect x="80" y="10" width="10" height="10" fill="currentColor"/>

                <rect x="0" y="70" width="30" height="30" fill="currentColor"/>
                <rect x="5" y="75" width="20" height="20" fill="white"/>
                <rect x="10" y="80" width="10" height="10" fill="currentColor"/>

                {/* Random data blocks */}
                <rect x="36" y="10" width="8" height="8" fill="currentColor"/>
                <rect x="48" y="14" width="8" height="8" fill="currentColor"/>
                <rect x="36" y="36" width="12" height="12" fill="currentColor"/>
                <rect x="52" y="36" width="10" height="10" fill="currentColor"/>
                <rect x="72" y="44" width="16" height="8" fill="currentColor"/>
                <rect x="40" y="60" width="12" height="8" fill="currentColor"/>
                <rect x="56" y="60" width="8" height="14" fill="currentColor"/>
                <rect x="72" y="72" width="20" height="8" fill="currentColor"/>
                <rect x="72" y="84" width="12" height="8" fill="currentColor"/>
                <rect x="40" y="80" width="8" height="12" fill="currentColor"/>
              </svg>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-forest-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Rescue Token</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-tight">
                Show this QR pass or read your Claim ID at the canteen counter to claim your food.
              </p>
              <div className="text-[10px] font-mono text-neutral-400">
                Claimed by: {claim.userName}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-forest-600 hover:bg-forest-700 transition-all shadow-sm"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
