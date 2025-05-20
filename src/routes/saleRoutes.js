// src/routes/saleRoutes.js
  const express = require('express');
  const router = express.Router();
  const fileService = require('../services/fileService');
  const authMiddleware = require('../middleware/authMiddleware');
  const { v4: uuidv4 } = require('uuid');
  const { handleError } = require('../utils/errorHandler');

  // GET: Obtener todas las ventas (sin autenticación, confirmar si es correcto)
  router.get('/', async (req, res) => {
    try {
      const sales = await fileService.readFile('src/data/sales.json');
      res.json(sales);
    } catch (error) {
      console.error('Error en GET /api/ventas:', error);
      handleError(res, error, 500);
    }
  });

  // POST: Crear una nueva venta (requiere API key y admin)
  router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
    try {
      const { productId, quantity, totalPrice, type = 'book', channel = 'online', clientId } = req.body;
      if (!productId || !quantity || !totalPrice) {
        return res.status(400).json({ error: 'Faltan campos requeridos: productId, quantity, totalPrice' });
      }
      const sales = await fileService.readFile('src/data/sales.json');
      const newSale = {
        id: uuidv4(),
        total: totalPrice,
        channel,
        date: new Date().toISOString(),
        clientId: clientId || null,
        items: [
          {
            productId,
            type,
            quantity
          }
        ]
      };
      sales.push(newSale);
      await fileService.writeFile('src/data/sales.json', sales);
      res.status(201).json(newSale);
    } catch (error) {
      console.error('Error en POST /api/ventas:', error);
      handleError(res, error, 500);
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