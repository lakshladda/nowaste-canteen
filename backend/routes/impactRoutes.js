const express = require('express');
const router = express.Router();
const { getImpactMetrics } = require('../controllers/statsController');

// Public impact metrics for campus transparency
router.get('/', getImpactMetrics);

module.exports = router;
