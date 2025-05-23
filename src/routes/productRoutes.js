// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);

// Permitir POST si hay sesión de admin O si hay API Key válida
router.post(
  '/',
  (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return authMiddleware.verifyApiKey(req, res, next);
  },
  authMiddleware.restrictToAdmin,
  productController.createProduct
);

router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, productController.deleteProduct);

module.exports = router;