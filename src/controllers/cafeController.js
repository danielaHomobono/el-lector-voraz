// src/controllers/cafeController.js
  const cafeService = require('../services/cafeService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllCafes(req, res) {
    try {
      const cafes = await cafeService.getCafes();
      res.json(cafes);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createCafe(req, res) {
    try {
      const cafeData = req.body;
      if (!cafeData.name || !cafeData.price || !cafeData.stock || !cafeData.category) {
        return res.status(400).json({ error: 'Nombre, precio, stock y categoría son requeridos' });
      }
      const newCafe = await cafeService.createCafe(cafeData);
      // Emitir evento de actualización de stock
      const io = req.app.get('io');
      io.emit('updateStock', { type: 'cafe', action: 'create', data: newCafe });
      res.status(201).json(newCafe);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updateCafe(req, res) {
    try {
      const { id } = req.params;
      const cafeData = req.body;
      if (!cafeData.name || !cafeData.price || !cafeData.stock || !cafeData.category) {
        return res.status(400).json({ error: 'Nombre, precio, stock y categoría son requeridos' });
      }
      const updatedCafe = await cafeService.updateCafe(id, cafeData);
      // Emitir evento de actualización de stock
      const io = req.app.get('io');
      io.emit('updateStock', { type: 'cafe', action: 'update', data: updatedCafe });
      res.json(updatedCafe);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deleteCafe(req, res) {
    try {
      const { id } = req.params;
      await cafeService.deleteCafe(id);
      // Emitir evento de actualización de stock
      const io = req.app.get('io');
      io.emit('updateStock', { type: 'cafe', action: 'delete', id });
      res.json({ message: 'Café eliminado exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllCafes, createCafe, updateCafe, deleteCafe };