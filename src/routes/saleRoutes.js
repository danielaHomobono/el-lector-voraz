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
    const saleData = req.body;
    if (!saleData.productId || !saleData.quantity || !saleData.totalPrice) {
      return res.status(400).json({ error: 'Faltan campos requeridos: productId, quantity, totalPrice' });
    }
    // Usar el servicio para actualizar la venta en MongoDB
    const updatedSale = await saleController.updateSale(req, res);
    // El controlador ya maneja la respuesta
  } catch (error) {
    console.error('Error en PUT /api/ventas/:id:', error);
    handleError(res, error, 500);
  }
});

// DELETE: Eliminar una venta (requiere API key y admin)
router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    await saleController.deleteSale(req, res);
    // El controlador ya maneja la respuesta
  } catch (error) {
    console.error('Error en DELETE /api/ventas/:id:', error);
    handleError(res, error, 500);
  }
});

module.exports = router;