// src/controllers/clientController.js
  const clientService = require('../services/clientService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllClients(req, res) {
    try {
      const clients = await clientService.getClients();
      res.json(clients);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createClient(req, res) {
    try {
      const clientData = req.body;
      if (!clientData.name || !clientData.email || clientData.points == null) {
        return res.status(400).json({ error: 'Nombre, email y puntos son requeridos' });
      }
      const newClient = await clientService.createClient(clientData);
      res.status(201).json(newClient);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updateClient(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;
      if (!clientData.name || !clientData.email || clientData.points == null) {
        return res.status(400).json({ error: 'Nombre, email y puntos son requeridos' });
      }
      const updatedClient = await clientService.updateClient(id, clientData);
      res.json(updatedClient);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deleteClient(req, res) {
    try {
      const { id } = req.params;
      await clientService.deleteClient(id);
      res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllClients, createClient, updateClient, deleteClient };