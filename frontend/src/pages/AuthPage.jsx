import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AuthPage = ({ setActivePage }) => {
  const { login, register, loginDemo } = useAuth();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    canteenName: 'Main Campus Canteen'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      setActivePage('available');
    } catch (err) {
      // Error is handled in context toast
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await loginDemo(role);
      setActivePage(role === 'admin' ? 'dashboard' : 'available');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 pb-20">
      
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center mx-auto text-2xl shadow-md shadow-forest-900/10">
          🌱
        </div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
          {isRegister ? 'Join NoWaste Canteen' : 'Welcome Back'}
        </h1>
        <p className="text-xs text-neutral-500">
          {isRegister
            ? 'Start rescuing campus surplus meals and earning eco badges'
            : 'Access your active rescue passes and campus food dashboard'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-6">
        
        {/* Toggle Login / Register */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              !isRegister ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              isRegister ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Fast Hackathon Test Logins */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Click Evaluator & Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white hover:bg-forest-50 border border-neutral-200 text-left transition-colors group"
            >
              <span className="block text-xs font-bold text-forest-800 group-hover:text-forest-900">
                Student / NGO
              </span>
              <span className="text-[10px] text-neutral-500 block truncate">
                student@nowaste.com
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-neutral-200 text-left transition-colors group"
            >
              <span className="block text-xs font-bold text-amber-800 group-hover:text-amber-900">
                Canteen Admin
              </span>
              <span className="text-[10px] text-neutral-500 block truncate">
                canteen@nowaste.com
              </span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {isRegister && (
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="student@nowaste.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-forest-600"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'student' }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.role === 'student'
                      ? 'bg-forest-50 border-forest-600 text-forest-800'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  Student / NGO
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'canteen_admin' }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.role === 'canteen_admin'
                      ? 'bg-amber-50 border-amber-600 text-amber-900'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  Canteen Staff
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-md shadow-forest-900/10 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Please wait...' : isRegister ? 'Register & Start Rescuing' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
};
