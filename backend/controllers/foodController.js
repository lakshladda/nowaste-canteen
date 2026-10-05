const { getDB, saveDB } = require('../config/db');
const { updateFoodStatus, refreshAllFoodStatuses } = require('../utils/expiryChecker');

const generateFoodId = () => 'food-' + Math.random().toString(36).substring(2, 9);

// Default high quality food images based on category or name if user doesn't supply one
const DEFAULT_IMAGES = {
  'Main Course': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Rice & Grains': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  'Breakfast / Snack': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  'Dessert / Fruit': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
};

// GET /api/food
// Dynamic filtering and search
const getAllFood = (req, res) => {
  try {
    const db = getDB();
    // Refresh smart expiry statuses based on current server time
    refreshAllFoodStatuses(db.foods);
    saveDB();

    let results = [...db.foods];
    const { search, category, dietType, canteen, status, minQuantity } = req.query;

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.canteen.toLowerCase().includes(q) ||
        f.pickupLocation.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      results = results.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }

    if (dietType && dietType !== 'all') {
      results = results.filter(f => f.dietType === dietType);
    }

    if (canteen && canteen !== 'All') {
      results = results.filter(f => f.canteen.toLowerCase() === canteen.toLowerCase());
    }

    if (status && status !== 'All') {
      results = results.filter(f => f.status === status);
    }

    if (minQuantity) {
      const min = parseInt(minQuantity, 10);
      if (!isNaN(min)) {
        results = results.filter(f => f.quantity >= min);
      }
    }

    // Sort: available items first, then nearest expiry
    results.sort((a, b) => {
      const statusOrder = { AVAILABLE: 1, ALMOST_CLAIMED: 2, FULLY_CLAIMED: 3, EXPIRED: 4 };
      const diff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      if (diff !== 0) return diff;
      return new Date(a.expiryTime) - new Date(b.expiryTime);
    });

    return res.json({ foods: results });
  } catch (err) {
    console.error('getAllFood error:', err);
    return res.status(500).json({ message: 'Failed to fetch food items' });
  }
};

// GET /api/food/:id
const getFoodById = (req, res) => {
  try {
    const db = getDB();
    const food = db.foods.find(f => f.id === req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    updateFoodStatus(food);
    saveDB();

    return res.json({ food });
  } catch (err) {
    console.error('getFoodById error:', err);
    return res.status(500).json({ message: 'Error retrieving food item' });
  }
};

// POST /api/food (Admin/Canteen only)
const createFood = (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      unit,
      dietType,
      image,
      canteen,
      pickupLocation,
      expiryTime,
      availableFrom,
      allergenInfo
    } = req.body;

    // Strict validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Food name is required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Please provide a valid quantity greater than 0' });
    }

    if (!pickupLocation || !pickupLocation.trim()) {
      return res.status(400).json({ message: 'Pickup location is required' });
    }

    if (!expiryTime) {
      return res.status(400).json({ message: 'Collection deadline (expiry time) is required' });
    }

    const expiryDate = new Date(expiryTime);
    if (isNaN(expiryDate.getTime())) {
      return res.status(400).json({ message: 'Invalid collection deadline date format' });
    }

    if (expiryDate <= new Date()) {
      return res.status(400).json({ message: 'Collection deadline must be in the future' });
    }

    const db = getDB();

    const newFood = {
      id: generateFoodId(),
      name: name.trim(),
      description: (description || 'Fresh surplus food prepared with care.').trim(),
      category: category || 'Main Course',
      quantity: qty,
      originalQuantity: qty,
      unit: unit || 'portions',
      dietType: dietType === 'non-veg' ? 'non-veg' : 'veg',
      image: (image && image.trim()) || DEFAULT_IMAGES[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      canteen: (canteen || req.user?.canteenName || 'Main Campus Canteen').trim(),
      pickupLocation: pickupLocation.trim(),
      postedAt: new Date().toISOString(),
      availableFrom: availableFrom ? new Date(availableFrom).toISOString() : new Date().toISOString(),
      expiryTime: expiryDate.toISOString(),
      allergenInfo: allergenInfo ? allergenInfo.trim() : 'Standard ingredients. Ask canteen staff for specifics.',
      status: 'AVAILABLE',
      createdBy: req.user?.id || 'usr-admin-1'
    };

    updateFoodStatus(newFood);
    db.foods.unshift(newFood);
    saveDB();

    return res.status(201).json({
      message: 'Surplus food posted successfully',
      food: newFood
    });
  } catch (err) {
    console.error('createFood error:', err);
    return res.status(500).json({ message: 'Failed to post surplus food' });
  }
};

// PUT /api/food/:id (Admin/Canteen only)
const updateFood = (req, res) => {
  try {
    const db = getDB();
    const index = db.foods.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const current = db.foods[index];
    const {
      name,
      description,
      category,
      quantity,
      unit,
      dietType,
      image,
      canteen,
      pickupLocation,
      expiryTime,
      allergenInfo,
      status
    } = req.body;

    if (quantity !== undefined) {
      const q = parseInt(quantity, 10);
      if (isNaN(q) || q < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
      }
      current.quantity = q;
    }

    if (name) current.name = name.trim();
    if (description) current.description = description.trim();
    if (category) current.category = category;
    if (unit) current.unit = unit;
    if (dietType) current.dietType = dietType;
    if (image) current.image = image.trim();
    if (canteen) current.canteen = canteen.trim();
    if (pickupLocation) current.pickupLocation = pickupLocation.trim();
    if (allergenInfo !== undefined) current.allergenInfo = allergenInfo.trim();
    if (expiryTime) current.expiryTime = new Date(expiryTime).toISOString();

    if (status && ['AVAILABLE', 'ALMOST_CLAIMED', 'EXPIRED', 'FULLY_CLAIMED'].includes(status)) {
      current.status = status;
    } else {
      updateFoodStatus(current);
    }

    db.foods[index] = current;
    saveDB();

    return res.json({
      message: 'Food item updated successfully',
      food: current
    });
  } catch (err) {
    console.error('updateFood error:', err);
    return res.status(500).json({ message: 'Failed to update food item' });
  }
};

// DELETE /api/food/:id (Admin/Canteen only)
const deleteFood = (req, res) => {
  try {
    const db = getDB();
    const index = db.foods.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    db.foods.splice(index, 1);
    saveDB();

    return res.json({ message: 'Food item removed successfully' });
  } catch (err) {
    console.error('deleteFood error:', err);
    return res.status(500).json({ message: 'Failed to delete food item' });
  }
};

// GET /api/food/meta/canteens - Get list of unique canteens and categories
const getMetadata = (req, res) => {
  const db = getDB();
  const canteens = [...new Set(db.foods.map(f => f.canteen))].filter(Boolean);
  const categories = [...new Set(db.foods.map(f => f.category))].filter(Boolean);
  return res.json({ canteens, categories });
};

module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMetadata
};
