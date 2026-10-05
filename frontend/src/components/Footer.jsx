import React from 'react';
import { Globe, Heart, ShieldCheck, Sparkles, Sprout } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white text-lg">
                🌱
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                NoWaste <span className="text-forest-400">Canteen</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Bridging the gap between surplus campus cafeteria food and hungry students & local NGOs.
              Together, we turn potential organic waste into nourishment and verifiable climate action.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Aligned with United Nations SDG 12: Target 12.3
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('available')}
                  className="hover:text-forest-400 transition-colors"
                >
                  Browse Surplus Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('impact')}
                  className="hover:text-forest-400 transition-colors"
                >
                  Campus Impact Score
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('claims')}
                  className="hover:text-forest-400 transition-colors"
                >
                  My Rescue Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('post')}
                  className="hover:text-forest-400 transition-colors"
                >
                  Canteen Portal
                </button>
              </li>
            </ul>
          </div>

          {/* SDG Impact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">SDG 12 Impact</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Target 12.3 aims to halve per capita global food waste at retail and consumer levels and reduce food losses along supply chains by 2030.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-400 font-semibold">
              <Sprout className="w-4 h-4" />
              <span>Zero-Waste Campus Initiative</span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} NoWaste Canteen. Built for campus sustainability & community nourishment.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Zero Hunger
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
