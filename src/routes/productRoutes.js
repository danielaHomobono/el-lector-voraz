// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);

// Ruta POST simplificada para crear productos
router.post('/', productController.createProduct);

router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, productController.deleteProduct);

module.exports = router;