const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/statsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, getAdminDashboard);

module.exports = router;
