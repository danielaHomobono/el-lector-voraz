const express = require('express');
const router = express.Router();
const SaleService = require('../services/saleService');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const sales = await SaleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una venta
router.post('/', authMiddleware, async (req, res) => {
  try {
    const sale = await SaleService.createSale(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;