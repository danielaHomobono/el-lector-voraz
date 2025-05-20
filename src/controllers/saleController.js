// src/controllers/saleController.js
  const saleService = require('../services/saleService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllSales(req, res) {
    try {
      const sales = await saleService.getSales();
      res.json(sales);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createSale(req, res) {
    try {
      const saleData = req.body;
      if (!saleData.productId || !saleData.quantity || !saleData.totalPrice) {
        return res.status(400).json({ error: 'ID del producto, cantidad y precio total son requeridos' });
      }
      const newSale = await saleService.createSale(saleData);
      res.status(201).json(newSale);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updateSale(req, res) {
    try {
      const { id } = req.params;
      const saleData = req.body;
      if (!saleData.productId || !saleData.quantity || !saleData.totalPrice) {
        return res.status(400).json({ error: 'ID del producto, cantidad y precio total son requeridos' });
      }
      const updatedSale = await saleService.updateSale(id, saleData);
      res.json(updatedSale);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deleteSale(req, res) {
    try {
      const { id } = req.params;
      await saleService.deleteSale(id);
      res.json({ message: 'Venta eliminada exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllSales, createSale, updateSale, deleteSale };