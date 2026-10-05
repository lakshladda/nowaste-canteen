const { getDB, saveDB } = require('../config/db');
const { updateFoodStatus } = require('../utils/expiryChecker');

// Generate unique Claim ID format: NW-2026-XXXX
const generateClaimId = () => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `NW-2026-${randNum}`;
};

// POST /api/claims
// Atomic claim creation
const createClaim = (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required' });
    }

    const claimQty = parseInt(quantity, 10);
    if (isNaN(claimQty) || claimQty <= 0) {
      return res.status(400).json({ message: 'Please specify a valid portion quantity' });
    }

    const db = getDB();

    // Find food item
    const food = db.foods.find(f => f.id === foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Refresh expiry
    updateFoodStatus(food);
    if (food.status === 'EXPIRED') {
      return res.status(400).json({ message: 'Sorry, this food collection deadline has passed and is no longer available.' });
    }

    if (food.quantity <= 0) {
      return res.status(400).json({ message: 'Sorry, this food is already fully claimed.' });
    }

    if (claimQty > food.quantity) {
      return res.status(400).json({
        message: `Only ${food.quantity} ${food.unit} remaining. You cannot claim ${claimQty}.`
      });
    }

    // Atomic decrement
    food.quantity -= claimQty;
    updateFoodStatus(food);

    // Create unique claim ID
    let uniqueId = generateClaimId();
    while (db.claims.some(c => c.claimId === uniqueId)) {
      uniqueId = generateClaimId();
    }

    const newClaim = {
      id: 'clm-' + Math.random().toString(36).substring(2, 9),
      claimId: uniqueId,
      userId: userId,
      foodId: food.id,
      quantity: claimQty,
      claimedAt: new Date().toISOString(),
      pickupTime: food.expiryTime,
      status: 'CONFIRMED',
      userName: req.user.name,
      foodName: food.name,
      canteenName: food.canteen,
      pickupLocation: food.pickupLocation,
      dietType: food.dietType,
      unit: food.unit,
      image: food.image
    };

    db.claims.unshift(newClaim);

    // Award Gamification Points: +10 for claiming
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.points = (user.points || 0) + (10 * claimQty);
    }

    saveDB();

    return res.status(201).json({
      message: 'Food claimed successfully! Here is your pickup pass.',
      claim: newClaim,
      updatedFood: food,
      pointsEarned: 10 * claimQty,
      totalPoints: user ? user.points : 0
    });
  } catch (err) {
    console.error('createClaim error:', err);
    return res.status(500).json({ message: 'Failed to process claim. Please try again.' });
  }
};

// GET /api/claims/my
const getMyClaims = (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.id;
    const userClaims = db.claims.filter(c => c.userId === userId);
    return res.json({ claims: userClaims });
  } catch (err) {
    console.error('getMyClaims error:', err);
    return res.status(500).json({ message: 'Failed to retrieve your claims' });
  }
};

// GET /api/claims (Admin view all claims)
const getAllClaims = (req, res) => {
  try {
    const db = getDB();
    return res.json({ claims: db.claims });
  } catch (err) {
    console.error('getAllClaims error:', err);
    return res.status(500).json({ message: 'Failed to retrieve claims' });
  }
};

// PUT /api/claims/:id (e.g. mark collected, cancelled)
const updateClaimStatus = (req, res) => {
  try {
    const { status } = req.body;
    if (!['CONFIRMED', 'COLLECTED', 'EXPIRED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid claim status' });
    }

    const db = getDB();
    const claim = db.claims.find(c => c.id === req.params.id || c.claimId === req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const oldStatus = claim.status;
    claim.status = status;

    // If cancelled, restore quantity back to food
    if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
      const food = db.foods.find(f => f.id === claim.foodId);
      if (food) {
        food.quantity += claim.quantity;
        updateFoodStatus(food);
      }
    }

    // If collected, award +20 bonus points to student!
    if (status === 'COLLECTED' && oldStatus !== 'COLLECTED') {
      const user = db.users.find(u => u.id === claim.userId);
      if (user) {
        user.points = (user.points || 0) + 20;
      }
    }

    saveDB();

    return res.json({
      message: `Claim status updated to ${status}`,
      claim
    });
  } catch (err) {
    console.error('updateClaimStatus error:', err);
    return res.status(500).json({ message: 'Failed to update claim status' });
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus
};
