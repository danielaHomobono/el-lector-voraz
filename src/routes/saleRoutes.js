// src/routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const { handleError } = require('../utils/errorHandler');
const Sale = require('../models/Sale');
const saleController = require('../controllers/saleController');

// GET: Obtener todas las ventas (ahora desde MongoDB)
router.get('/', authMiddleware.verifyApiKey, saleController.getAllSales);

// POST: Crear una nueva venta (requiere solo API key)
router.post('/', authMiddleware.verifyApiKey, saleController.createSale);

// Nueva ruta para obtener una venta por ID
router.get('/:id', authMiddleware.verifyApiKey, async (req, res) => {
  try {
    const sale = await saleController.getSaleById(req, res);
    // No necesitamos hacer nada más aquí, el controlador ya maneja la respuesta
  } catch (error) {
    console.error('Error en GET /api/ventas/:id:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Modificar una venta (requiere API key y admin)
router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, totalPrice, type = 'book', channel = 'online', clientId } = req.body;
    if (!productId || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Faltan campos requeridos: productId, quantity, totalPrice' });
    }
    const sales = await fileService.readFile('src/data/sales.json');
    const saleIndex = sales.findIndex(sale => sale.id === id);
    if (saleIndex === -1) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    sales[saleIndex] = {
      id,
      total: totalPrice,
      channel,
      date: sales[saleIndex].date, // Mantener la fecha original
      clientId: clientId || null,
      items: [
        {
          productId,
          type,
          quantity
        }
      ]
    };
    await fileService.writeFile('src/data/sales.json', sales);
    res.json(sales[saleIndex]);
  } catch (error) {
    console.error('Error en PUT /api/ventas/:id:', error);
    handleError(res, error, 500);
  }
});

// DELETE: Eliminar una venta (requiere API key y admin)
router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await fileService.readFile('src/data/sales.json');
    const saleIndex = sales.findIndex(sale => sale.id === id);
    if (saleIndex === -1) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    const deletedSale = sales.splice(saleIndex, 1)[0];
    await fileService.writeFile('src/data/sales.json', sales);
    res.json(deletedSale);
  } catch (error) {
    console.error('Error en DELETE /api/ventas/:id:', error);
    handleError(res, error, 500);
  }
});

module.exports = router;