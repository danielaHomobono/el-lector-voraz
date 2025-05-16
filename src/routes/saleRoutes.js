const express = require('express');
const router = express.Router();
const saleService = require('../services/saleService');
const authMiddleware = require('../middleware/authMiddleware');
const validateSale = require('../middleware/validateSale');

router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, validateSale, async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;