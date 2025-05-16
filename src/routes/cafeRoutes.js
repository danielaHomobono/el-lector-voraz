const express = require('express');
const router = express.Router();
const cafeService = require('../services/cafeService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const products = await cafeService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const product = await cafeService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const product = await cafeService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;