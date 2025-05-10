const express = require('express');
const router = express.Router();
const SaleService = require('../services/saleService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sales = await SaleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, channel, clientId, redeemPoints } = req.body;
    if (!items || !items.length || !channel) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    for (const item of items) {
      if (!item.productId || !item.type || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Ítems inválidos' });
      }
    }
    const sale = await SaleService.createSale(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;