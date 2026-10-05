import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AvailableFoodPage } from './pages/AvailableFoodPage';
import { FoodDetailsPage } from './pages/FoodDetailsPage';
import { PostFoodPage } from './pages/PostFoodPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { ClaimModal } from './components/ClaimModal';
import { PickupPassModal } from './components/PickupPassModal';

function AppContent() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedFood, setSelectedFood] = useState(null);

  // Claim & Pickup pass modal states
  const [claimModalFood, setClaimModalFood] = useState(null);
  const [activePickupPass, setActivePickupPass] = useState(null);

  const { isAuthenticated, loginDemo } = useAuth();
  const { showToast } = useToast();

  const handleOpenClaim = (food) => {
    if (!isAuthenticated) {
      showToast('Please sign in or use 1-click test login to claim surplus food', 'info');
      setActivePage('login');
      return;
    }
    setClaimModalFood(food);
  };

  const handleClaimSuccess = (newClaim, updatedFood) => {
    setClaimModalFood(null);
    // If details page is currently open for this food, update its state
    if (selectedFood && selectedFood.id === updatedFood.id) {
      setSelectedFood(updatedFood);
    }
    // Immediately show digital pickup pass
    setActivePickupPass(newClaim);
  };

  const handleViewDetails = (food) => {
    setSelectedFood(food);
    setActivePage('details');
  };

  const handleViewPass = (claim) => {
    setActivePickupPass(claim);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-neutral-800">
      
      {/* Top Navigation Bar with Mobile Hamburger */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onOpenFood={handleOpenClaim}
          />
        )}

        {activePage === 'available' && (
          <AvailableFoodPage
            onClaimFood={handleOpenClaim}
            onViewDetails={handleViewDetails}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'details' && selectedFood && (
          <FoodDetailsPage
            food={selectedFood}
            onBack={() => setActivePage('available')}
            onClaim={handleOpenClaim}
          />
        )}

        {activePage === 'post' && (
          <PostFoodPage setActivePage={setActivePage} />
        )}

        {activePage === 'claims' && (
          <MyClaimsPage
            onViewPass={handleViewPass}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          <AdminDashboardPage setActivePage={setActivePage} />
        )}

        {activePage === 'impact' && (
          <ImpactDashboardPage />
        )}

        {activePage === 'login' && (
          <AuthPage setActivePage={setActivePage} />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Claim Confirmation Modal */}
      {claimModalFood && (
        <ClaimModal
          food={claimModalFood}
          isOpen={!!claimModalFood}
          onClose={() => setClaimModalFood(null)}
          onClaimSuccess={handleClaimSuccess}
        />
      )}

      {/* Digital Pickup Pass Modal with QR Visual */}
      {activePickupPass && (
        <PickupPassModal
          claim={activePickupPass}
          isOpen={!!activePickupPass}
          onClose={() => setActivePickupPass(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
