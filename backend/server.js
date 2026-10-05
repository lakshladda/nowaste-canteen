const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { resetToSeed } = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const claimRoutes = require('./routes/claimRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const impactRoutes = require('./routes/impactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/impact', impactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'NoWaste Canteen API',
    goal: 'SDG 12: Responsible Consumption and Production',
    timestamp: new Date().toISOString()
  });
});

// Demo reset endpoint (optional convenience for live testing/eval)
app.post('/api/reset-demo', (req, res) => {
  resetToSeed();
  res.json({ message: 'Database reset to clean demo seed state successfully' });
});

// Serve frontend build if dist exists
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🌱 NoWaste Canteen server running on port ${PORT}`);
  console.log(`🎯 Serving UN SDG 12 Surplus Food Rescue Platform at http://localhost:${PORT}`);
  console.log(`🩺 Health check ready at: http://localhost:${PORT}/api/health`);
});
