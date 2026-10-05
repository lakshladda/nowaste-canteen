/**
 * Smart Expiry & Status Evaluator
 * Evaluates real timestamps against current server time and quantity levels.
 */
const updateFoodStatus = (food) => {
  const now = new Date();
  const expiry = new Date(food.expiryTime);

  // If already marked as EXPIRED or manual status isn't overriding, check time
  if (now > expiry) {
    food.status = 'EXPIRED';
  } else if (food.quantity <= 0) {
    food.status = 'FULLY_CLAIMED';
  } else if (food.quantity <= 5) {
    food.status = 'ALMOST_CLAIMED';
  } else {
    food.status = 'AVAILABLE';
  }

  return food;
};

const refreshAllFoodStatuses = (foods) => {
  return foods.map(updateFoodStatus);
};

module.exports = {
  updateFoodStatus,
  refreshAllFoodStatuses
};
