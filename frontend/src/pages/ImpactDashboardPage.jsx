import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  Utensils,
  Award,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Calendar,
  PieChart,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const ImpactDashboardPage = () => {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      setLoading(true);
      try {
        const [impRes, leadRes] = await Promise.all([
          api.getImpactMetrics(),
          api.getLeaderboard()
        ]);
        setImpactData(impRes);
        setLeaderboard(leadRes.leaderboard || []);
      } catch (err) {
        console.error('Impact load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const impact = impactData?.impact || {
    foodRescuedKg: 125,
    mealsSaved: 438,
    wastePreventedKg: 125,
    co2AvoidedKg: 312,
    activeUsers: 247,
    successfulClaims: 386,
    campusRescueScore: 82
  };

  const categories = impactData?.categoryBreakdown || [
    { category: 'Main Course', portions: 240, percentage: 55 },
    { category: 'Rice & Grains', portions: 110, percentage: 25 },
    { category: 'Breakfast / Snack', portions: 50, percentage: 11 },
    { category: 'Dessert / Fruit', portions: 38, percentage: 9 }
  ];

  const rescuedPerDay = impactData?.rescuedPerDay || [];
  const rescuedPerWeek = impactData?.rescuedPerWeek || [];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              SDG 12 Campus Impact Dashboard
            </h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Verifiable greenhouse gas reduction & organic surplus food diversion metrics.
          </p>
        </div>

        {/* SDG 12 Target Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-100/90 text-forest-900 text-xs font-bold border border-forest-200 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-600"></span>
          <span>Target 12.3: Halve Food Waste</span>
        </div>
      </div>

      {/* Sustainability Message Banner */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Campus Sustainability Vision</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            “Every successful claim is one less meal wasted.”
          </h2>
          <p className="text-xs text-forest-200 max-w-xl">
            Redirecting prepared meals saves the embedded water, agricultural energy, and packaging while cutting municipal landfill burden.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-200 block">
            GHG Emissions Avoided
          </span>
          <span className="text-3xl font-black text-white mt-1 block">
            ~{impact.co2AvoidedKg || Math.round(impact.foodRescuedKg * 2.5)} <span className="text-base font-bold">kg CO₂e</span>
          </span>
          <span className="text-[10px] text-forest-300">Equivalent to planting 15 trees</span>
        </div>
      </div>

      {/* Campus Food Rescue Score Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Campus Food Rescue Score
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-black text-forest-800">
                {impact.campusRescueScore}%
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Green Gold Campus Status
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 max-w-xs text-left sm:text-right">
            Calculated as the ratio of cafeteria surplus rescued vs total logged surplus across campus halls.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
            <div
              className="h-full bg-forest-600 rounded-full transition-all duration-1000 shadow-inner"
              style={{ width: `${impact.campusRescueScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 font-semibold px-1">
            <span>0% High Waste</span>
            <span>Target: 80%</span>
            <span>100% Zero Food Waste</span>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Food Rescued"
          value={impact.foodRescuedKg}
          unit="kg"
          icon={Leaf}
          color="forest"
          subtitle="Diverted from waste"
        />
        <StatCard
          title="Meals Saved"
          value={impact.mealsSaved}
          unit="meals"
          icon={Utensils}
          color="emerald"
          subtitle="Direct human nourishment"
        />
        <StatCard
          title="Waste Prevented"
          value={impact.wastePreventedKg}
          unit="kg"
          icon={TrendingUp}
          color="amber"
          subtitle="Organic mass saved"
        />
        <StatCard
          title="Active Users"
          value={impact.activeUsers}
          icon={Users}
          color="blue"
          subtitle="Students, NGOs & staff"
        />
        <StatCard
          title="Successful Claims"
          value={impact.successfulClaims}
          icon={Award}
          color="purple"
          subtitle="Completed rescue passes"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Rescued Food Per Day (Interactive CSS Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-forest-600" />
                <span>Food Rescued Per Day (Portions)</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Daily surplus volume claimed across campus canteens
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-400">Past 7 Days</span>
          </div>

          <div className="h-56 pt-6 flex items-end justify-between gap-2 border-b border-neutral-200 pb-2">
            {rescuedPerDay.map((d, i) => {
              const maxVal = Math.max(...rescuedPerDay.map(x => x.portions), 50);
              const heightPct = Math.min(100, Math.max(15, (d.portions / maxVal) * 100));
              const isToday = d.day === 'Today';

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.portions}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-forest-600 hover:bg-forest-700 shadow-md shadow-forest-900/10'
                        : 'bg-forest-200 hover:bg-forest-300'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className={`text-[11px] font-semibold ${isToday ? 'text-forest-800 font-bold' : 'text-neutral-500'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-600" />
                <span>Most Rescued Food Categories</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Surplus portion distribution by menu type
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {categories.map((cat, i) => {
              const colors = [
                'bg-forest-600',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-blue-500'
              ];
              const barColor = colors[i % colors.length];

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-neutral-800">{cat.category}</span>
                    <span className="text-neutral-500 font-bold">
                      {cat.portions} portions ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Gamification & Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gamification Badges Explainer */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Campus Food Saver Badges</span>
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Students and NGOs earn points with each rescued portion.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <span className="text-2xl">🥇</span>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Zero Waste Champion</h4>
                <p className="text-[11px] text-neutral-600">500+ points or Rank 1 monthly</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-2xl">🥈</span>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Waste Warrior</h4>
                <p className="text-[11px] text-neutral-600">350+ points or active weekly participant</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-50/60 border border-forest-200/70">
              <span className="text-2xl">🥉</span>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Food Saver</h4>
                <p className="text-[11px] text-neutral-600">Earned upon first meal claim (+10 pts)</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 p-3 rounded-xl text-[11px] text-neutral-600 space-y-1 border border-neutral-200/60">
            <div className="font-bold text-neutral-800">Point Breakdown:</div>
            <div>• Claim food: +10 pts per portion</div>
            <div>• Collect at canteen desk: +20 bonus pts</div>
          </div>
        </div>

        {/* Top Savers Leaderboard */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-forest-600" />
                <span>Top Campus Food Rescuers</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Monthly leaderboard of students and campus organizations
              </p>
            </div>
            <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full">
              Live Standings
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {leaderboard.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50/60 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    item.rank === 1
                      ? 'bg-amber-100 text-amber-900 font-extrabold'
                      : item.rank === 2
                      ? 'bg-neutral-200 text-neutral-800'
                      : item.rank === 3
                      ? 'bg-orange-100 text-orange-900'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {item.rank}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-forest-700">
                    {item.points}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-semibold">
                    points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
