# 🌱 NoWaste Canteen
### Campus Surplus Food Rescue & UN SDG 12 Platform

[![UN SDG 12](https://img.shields.io/badge/UN%20SDG-12%20Responsible%20Consumption%20%26%20Production-green.svg)](https://sdgs.un.org/goals/goal12)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue.svg)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/System-Fully%20Operational-success.svg)]()

> **“Save Food. Share More. Waste Less.”**  
> NoWaste Canteen connects edible surplus meals from college dining halls with hungry students and community NGOs before meal closures.

---

## 📌 1. Core Problem & UN SDG 12 Mission
Every day, university and college canteens prepare meals in volume. Due to variable student attendance, substantial quantities of perfectly prepared, safe, and nutritious food remain unserved at the end of lunch and dinner shifts. Without real-time visibility, this food is discarded into campus landfills, generating methane emissions.

**NoWaste Canteen closes this loop**:
$$\text{Canteen Posts Surplus} \longrightarrow \text{Students/NGOs Discover} \longrightarrow \text{Instant Claim} \longrightarrow \text{Digital Pickup Pass} \longrightarrow \text{SDG 12 Impact Logged}$$

Directly addresses **UN SDG 12 (Target 12.3)**: *Halve per capita global food waste at retail and consumer levels and reduce food losses along production and supply chains.*

---

## 🚀 2. Quick Start & Execution

### Prerequisites
- Node.js (v18+ or v24 LTS recommended)
- npm (v10+)

### Running the Application (All-in-One)
```bash
# Navigate to the project directory
cd "C:\Users\laksh\.gemini\antigravity\scratch\nowaste-canteen"

# Start the unified server (serves both API & Frontend on port 5000)
node backend/server.js
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### Running in Development Mode (with Vite Hot Reloading)
If you want to modify frontend components with live HMR:
```bash
# Terminal 1: Backend API
cd backend
node server.js

# Terminal 2: Frontend Vite Dev Server
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser (API calls automatically proxy to `:5000`).

---

## 🎯 3. Live Demo Scenario Walkthrough (For Evaluators & Judges)

The system includes pre-configured demo credentials and 1-click test buttons for an instant hackathon presentation:

### Test Credentials
| Role | Email | Password | Preloaded Points |
| :--- | :--- | :--- | :--- |
| **Canteen Admin** | `canteen@nowaste.com` | `canteen123` | Canteen Management Portal |
| **Student** | `student@nowaste.com` | `student123` | 420 pts (🥉 Food Saver) |
| **Campus NGO** | `ngo@nowaste.com` | `ngo123` | 580 pts (🥇 Zero Waste Champion) |

### Complete Live Demo Verification Flow:
1. **Login as Canteen Admin**:
   - Go to Sign In page or click the `Hackathon Demo Mode` banner at top of Landing Page -> click **"Quick Login: Canteen Admin"**.
2. **Post Surplus Food**:
   - Click **Post Food** in the navbar.
   - Enter `Vegetable Biryani`, `20` portions, Pickup: `Main Canteen Counter 3`, Deadline: today.
   - Click **POST SURPLUS FOOD**.
   - Notice instant success notification and redirection to the **Canteen Operations Dashboard**.
3. **Verify Public Feed**:
   - Click **Available Food** in navbar.
   - The newly posted Vegetable Biryani is live with status `🟢 Available` and 20 portions remaining.
4. **Switch to Student**:
   - Click **Sign Out** or click **"Quick Login: Student"**.
5. **Claim Surplus Portions**:
   - Open **Available Food** -> click **Claim Now** (or open **Details** to review allergen info and deadline warnings).
   - In the Claim Confirmation Modal, select **2 portions**.
   - Click **Confirm Claim**.
   - **Confetti fires!**
   - Available quantity instantly drops from **20 → 18** in database.
   - Student receives **+20 Food Saver Points**!
6. **Digital Rescue Pass**:
   - An official **FOOD RESCUE PASS** modal appears with a unique Claim ID (`NW-2026-XXXX`), scannable QR matrix, and pickup location.
7. **View in My Claims**:
   - Click **My Claims** to see the confirmed claim with status `CONFIRMED`.
8. **Inspect Impact Dashboard**:
   - Click **Impact** in navbar.
   - See **Meals Rescued** incremented (+2), **Waste Prevented (kg)** dynamically updated, and the **Campus Food Rescue Score** progress bar reflecting real data.

---

## 🏗️ 4. Technical Architecture

### Frontend
- **React 18**: Modular component-based architecture.
- **Vite 6**: Ultra-fast build and HMR toolchain.
- **Tailwind CSS**: Sustainability-themed palette (`#15803d` deep forest green, `#22c55e` fresh leaf, `#faf8f5` warm cream).
- **Lucide Icons**: Semantic iconography for diets, statuses, and sustainability metrics.
- **Canvas Confetti**: Celebratory micro-interactions for rescued food claims.

### Backend
- **Node.js + Express**: RESTful API with structured routes and controllers.
- **JWT Authentication**: Bearer tokens with role-based route protection (`canteen_admin` vs `student`).
- **Atomic Operations**: Thread-safe portion decrements preventing negative stock or overclaiming.
- **Smart Expiry Engine**: Evaluates timestamps in real-time (`AVAILABLE` -> `ALMOST_CLAIMED` -> `FULLY_CLAIMED` -> `EXPIRED`).
- **Data Persistence**: Robust JSON document store in `backend/data/db.json` with atomic temp-file swaps, preserving all data across server restarts with zero external setup.

---

## 📂 5. Directory Structure
```
nowaste-canteen/
├── package.json                 # Root script runner
├── README.md                    # Documentation & hackathon guide
├── backend/
│   ├── server.js                # Express app & static dist host
│   ├── package.json
│   ├── test-demo-scenario.js    # Automated 10-step end-to-end verification
│   ├── config/
│   │   └── db.js                # Persistent database manager & sample seeds
│   ├── controllers/
│   │   ├── authController.js    # Auth & gamification leaderboard
│   │   ├── foodController.js    # Dynamic search, filters & CRUD
│   │   ├── claimController.js   # Atomic claiming & pass generation
│   │   └── statsController.js   # Real-time SDG impact & dashboard calculations
│   ├── middleware/
│   │   └── auth.js              # JWT & role verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── impactRoutes.js
│   └── utils/
│       └── expiryChecker.js     # Real-time timestamp expiry logic
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx              # Main orchestrator
        ├── index.css            # Tailwind directives & typography
        ├── components/
        │   ├── Navbar.jsx       # Responsive navbar + hamburger menu
        │   ├── Footer.jsx       # SDG 12 mission & quick links
        │   ├── FoodCard.jsx     # Food card with status badges & countdowns
        │   ├── ClaimModal.jsx   # Portion selector & point preview
        │   ├── PickupPassModal.jsx # Perforated ticket with QR visual
        │   └── StatCard.jsx     # Reusable dashboard metric card
        ├── context/
        │   ├── AuthContext.jsx  # Authentication & demo account switcher
        │   └── ToastContext.jsx # Toast notification alert system
        ├── pages/
        │   ├── LandingPage.jsx  # Hero, SDG 12 branding, stats, how-it-works
        │   ├── AvailableFoodPage.jsx # Multi-filtering & search feed
        │   ├── FoodDetailsPage.jsx # Deep view, allergens, deadline alerts
        │   ├── PostFoodPage.jsx # Canteen staff submission portal
        │   ├── MyClaimsPage.jsx # Student claim log & pass launcher
        │   ├── AdminDashboardPage.jsx # Canteen operations & posted vs claimed chart
        │   ├── ImpactDashboardPage.jsx # SDG 12 metrics, charts & leaderboard
        │   └── AuthPage.jsx     # Login/Register with 1-click test helpers
        └── services/
            └── api.js           # Centralized API client
```

---

## 🏆 6. Automated Verification Test
You can run the automated 10-step demo verification test anytime:
```bash
cd backend
node test-demo-scenario.js
```
**Output**:
```
✅ Admin logged in: Central Canteen Manager (canteen_admin)
✅ Surplus food posted successfully: Vegetable Biryani (Demo Batch), 20 portions
✅ Verified in public feed: Vegetable Biryani is AVAILABLE with 20 portions
✅ Student logged in: Rahul Sharma, Initial Points=420
✅ Claim Confirmed! Digital Claim ID: NW-2026-6346 (2 portions)
✅ Quantity accurately updated 20 -> 18!
✅ Found claim NW-2026-6346 in My Claims with status: CONFIRMED
✅ Impact metrics dynamically updated! (+2 meals saved)
✅ Correctly rejected invalid claim: "Only 18 portions remaining. You cannot claim 25."
🎉 ALL 10 STEPS OF THE CORE DEMO FLOW PASSED WITH 100% SUCCESS!
```
