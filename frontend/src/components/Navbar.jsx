import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  Award,
  BarChart3,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, isAuthenticated, isAdmin, logout, loginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'available', label: 'Available Food' },
    { id: 'claims', label: 'My Claims', requiresAuth: true },
    { id: 'impact', label: 'Impact' },
    ...(isAdmin ? [
      { id: 'post', label: 'Post Food' },
      { id: 'dashboard', label: 'Admin Dashboard' }
    ] : [
      { id: 'post', label: 'Post Food' } // students clicking this can see a prompt to log in as canteen admin or test it
    ])
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & SDG 12 Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-white shadow-md shadow-forest-900/10 group-hover:bg-forest-800 transition-colors">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-forest-700 transition-colors">
                  NoWaste <span className="text-forest-600 font-extrabold">Canteen</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <span className="inline-block w-2 h-2 rounded-full bg-forest-500"></span>
                  UN SDG 12 Platform
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest-700 font-bold border border-forest-200/60 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Points / User / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Gamification Points pill for student */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user.points || 0} pts</span>
                </div>

                {/* User Info & Role Tag */}
                <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-neutral-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isAdmin ? 'bg-forest-100 text-forest-800' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {isAdmin ? 'Canteen Staff' : 'Student / NGO'}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-forest-700 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('available')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 rounded-lg shadow-sm transition-all"
                >
                  Find Food
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{user.points || 0}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-forest-50 text-forest-700 font-bold border border-forest-200'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2 py-2">
                <div>
                  <div className="text-sm font-bold text-neutral-900">{user.name}</div>
                  <div className="text-xs text-neutral-500">{user.email} ({isAdmin ? 'Canteen Admin' : 'Student'})</div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-neutral-800 bg-neutral-100 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('available')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-forest-600 rounded-xl"
                >
                  Claim Food
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
