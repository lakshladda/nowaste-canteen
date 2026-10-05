const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus
} = require('../controllers/claimController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', authenticate, createClaim);
router.get('/my', authenticate, getMyClaims);
router.get('/', authenticate, requireAdmin, getAllClaims);
router.put('/:id', authenticate, updateClaimStatus);

module.exports = router;
