const express = require('express');
const router = express.Router();
const { register, login, getMe, getLeaderboard } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
