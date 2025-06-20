const express = require('express');
const router = express.Router();
const cafeStockController = require('../controllers/cafeStockController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply admin-only middleware to all routes
router.use(authMiddleware.restrictToAdmin);

// Get all cafe stock items
router.get('/', cafeStockController.getAllCafeStock);

// Get a single cafe stock item
router.get('/:id', cafeStockController.getCafeStockById);

// Create a new cafe stock item
router.post('/', cafeStockController.createCafeStock);

// Update a cafe stock item
router.put('/:id', cafeStockController.updateCafeStock);

// Delete a cafe stock item
router.delete('/:id', cafeStockController.deleteCafeStock);

module.exports = router;