import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  TrendingUp,
  Heart,
  Users,
  Award,
  ChevronRight,
  Leaf,
  Utensils,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ setActivePage, onOpenFood }) => {
  const { user, isAuthenticated, isAdmin, loginDemo } = useAuth();
  const [stats, setStats] = useState({
    foodRescuedKg: 125,
    mealsSaved: 438,
    wastePreventedKg: 125,
    activeUsers: 247,
    successfulClaims: 386,
    campusRescueScore: 82
  });
  const [featuredFoods, setFeaturedFoods] = useState([]);

  useEffect(() => {
    // Fetch live impact numbers & featured surplus food
    const loadData = async () => {
      try {
        const impactRes = await api.getImpactMetrics();
        if (impactRes.impact) {
          setStats(impactRes.impact);
        }
        const foodRes = await api.getFoods({ status: 'AVAILABLE' });
        if (foodRes.foods) {
          setFeaturedFoods(foodRes.foods.slice(0, 3));
        }
      } catch (err) {
        console.warn('Using baseline metrics:', err);
      }
    };
    loadData();
  }, []);

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Canteen Posts',
      desc: 'Canteen staff log usable surplus food portions, pickup desks, and collection deadlines at meal closures.',
      icon: Utensils,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      step: '02',
      title: 'Students Discover',
      desc: 'Students and verified local NGOs browse fresh surplus food options nearby in real time with dynamic filters.',
      icon: Users,
      color: 'bg-forest-100 text-forest-800'
    },
    {
      step: '03',
      title: 'Claim Food',
      desc: 'Users reserve portions before the expiry deadline. Available quantity decrements immediately in the database.',
      icon: Clock,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      step: '04',
      title: 'Collect with QR',
      desc: 'User presents their digital Food Rescue Pass at the designated canteen desk to collect their meal.',
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      step: '05',
      title: 'Waste Reduced',
      desc: 'Every rescued meal contributes to the verifiable campus sustainability score and prevents methane emissions.',
      icon: Leaf,
      color: 'bg-green-100 text-green-800'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Quick Demo Switcher Banner for Evaluators / Judges */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-950 text-white px-4 py-3 rounded-2xl shadow-md border border-forest-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-forest-600 font-bold uppercase text-[10px] tracking-wider text-forest-100">
            Hackathon Demo Mode
          </span>
          <span className="text-forest-200">
            Currently logged in: <strong className="text-white">{user ? `${user.name} (${user.role})` : 'Guest'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loginDemo('student')}
            className="px-2.5 py-1 rounded-lg bg-forest-700 hover:bg-forest-600 text-white font-medium transition-colors"
          >
            Quick Login: Student
          </button>
          <button
            onClick={() => loginDemo('admin')}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
          >
            Quick Login: Canteen Admin
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* SDG 12 Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping"></span>
              <span>UN SDG 12: Responsible Consumption & Production</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
              Save Food. <br />
              <span className="text-forest-600">Share More.</span> <br />
              Waste Less.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
              NoWaste Canteen connects surplus food from campus canteens with students and NGOs before it becomes waste.
              Fresh, hygienic cafeteria meals rescued with just a click.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('available')}
                className="py-3.5 px-7 rounded-xl text-base font-bold text-white bg-forest-600 hover:bg-forest-700 transition-all shadow-lg shadow-forest-900/15 flex items-center justify-center gap-2 group"
              >
                <span>Find Surplus Food</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (isAdmin) {
                    setActivePage('post');
                  } else {
                    setActivePage('post');
                  }
                }}
                className="py-3.5 px-6 rounded-xl text-base font-bold text-forest-900 bg-white hover:bg-forest-50 border border-forest-200 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Utensils className="w-5 h-5 text-forest-700" />
                <span>Post Surplus Food</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>100% Free Campus Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-600" />
                <span>Verified Cafeteria Kitchens</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Illustration & Live Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Backing decorative blur circles */}
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-forest-200/50 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-100/60 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main Showcase Card */}
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Live Surplus Feed
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full">
                    Campus Network
                  </span>
                </div>

                {/* Hero Item Preview */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm h-52 group">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                    alt="Vegetable Biryani"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-bold">
                    🟢 Available Now
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span className="text-xs text-amber-300 font-semibold">Main Campus Canteen</span>
                    <h3 className="text-lg font-bold leading-tight">Vegetable Biryani & Raita</h3>
                    <div className="flex items-center justify-between text-xs text-neutral-200 pt-1">
                      <span>Available: <strong>18 portions</strong></span>
                      <span className="text-amber-300">Collect before 7:30 PM</span>
                    </div>
                  </div>
                </div>

                {/* Digital Rescue Pass Snippet */}
                <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Digital Pickup Pass
                    </span>
                    <span className="font-mono text-xs font-bold text-forest-900">
                      NW-2026-1048
                    </span>
                    <p className="text-[11px] text-neutral-600">Counter 3 Express Pickup</p>
                  </div>

                  <button
                    onClick={() => setActivePage('available')}
                    className="py-2 px-3.5 rounded-xl bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 transition-colors shrink-0 shadow-xs"
                  >
                    Claim Food
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-forest-700">
            Real-Time Campus Impact
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Transforming Leftover Portions Into Sustainable Change
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-forest-50/70 border border-forest-100 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Meals Rescued
            </span>
            <div className="text-3xl sm:text-4xl font-black text-forest-950">
              {stats.mealsSaved}
            </div>
            <p className="text-xs text-forest-700">Portions saved this month</p>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Food Waste Prevented
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-950">
              {stats.wastePreventedKg} <span className="text-base font-bold">kg</span>
            </div>
            <p className="text-xs text-amber-700">Diverted from campus landfills</p>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Active Donations
            </span>
            <div className="text-3xl sm:text-4xl font-black text-blue-950">
              {stats.successfulClaims}
            </div>
            <p className="text-xs text-blue-700">Completed rescue claims</p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Students Helped
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950">
              {stats.activeUsers}
            </div>
            <p className="text-xs text-emerald-700">Campus community members</p>
          </div>

        </div>

        {/* Campus Score Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Campus Food Rescue Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-forest-800">{stats.campusRescueScore}%</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Excellence Tier
              </span>
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
              <div
                className="h-full bg-forest-600 rounded-full transition-all duration-1000"
                style={{ width: `${stats.campusRescueScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-semibold">
              <span>Zero Baseline</span>
              <span>SDG 12 Target Goal: 80%+</span>
            </div>
          </div>
        </div>

      </section>

      {/* How It Works Section */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 5-Step Process</span>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            How NoWaste Canteen Works
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            A frictionless loop designed for busy college dining services, student schedules, and local community partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-forest-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-neutral-300 font-mono">
                      {step.step}
                    </span>
                    <div className={`p-2.5 rounded-xl ${step.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Available Surplus Food Preview */}
      {featuredFoods.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Freshly Posted Surplus Food
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Available right now on campus for rescue
              </p>
            </div>
            <button
              onClick={() => setActivePage('available')}
              className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1 group"
            >
              <span>View All Items</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFoods.map(food => (
              <div
                key={food.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-44 relative bg-neutral-100 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                    🟢 Available
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded">
                    {food.canteen}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{food.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{food.pickupLocation}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs font-bold text-forest-700">
                      {food.quantity} {food.unit} remaining
                    </span>
                    <button
                      onClick={() => {
                        onOpenFood(food);
                      }}
                      className="text-xs font-bold text-white bg-forest-600 hover:bg-forest-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Claim Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SDG 12 Mission Statement */}
      <section className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-forest-200 text-xs font-bold">
            <Leaf className="w-3.5 h-3.5 text-forest-400" />
            <span>UN Sustainable Development Goal 12</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            “Responsible Consumption & Production Starts at Our Cafeteria Tables.”
          </h2>
          <p className="text-sm text-forest-200 leading-relaxed">
            Global food systems account for up to 30% of total greenhouse gas emissions, with unconsumed edible food contributing significantly to methane release. By matching excess portions directly with campus consumers in real time, NoWaste Canteen turns waste into social good.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('impact')}
              className="py-3 px-6 rounded-xl text-xs font-bold text-forest-950 bg-white hover:bg-forest-50 transition-colors shadow-md"
            >
              Explore Full Impact Report
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
