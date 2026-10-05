const express = require('express');
const router = express.Router();
const {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMetadata
} = require('../controllers/foodController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/meta/categories-canteens', getMetadata);
router.get('/', getAllFood);
router.get('/:id', getFoodById);
router.post('/', authenticate, requireAdmin, createFood);
router.put('/:id', authenticate, requireAdmin, updateFood);
router.delete('/:id', authenticate, requireAdmin, deleteFood);

module.exports = router;
