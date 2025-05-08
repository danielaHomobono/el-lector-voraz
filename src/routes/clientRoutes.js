const express = require('express');
const router = express.Router();
const ClientService = require('../services/clientService');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clients = await ClientService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un cliente con validación de campos
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, points } = req.body;

    if (!name || !email || typeof points !== 'number') {
      return res.status(400).json({
        error: 'Faltan campos requeridos: name, email y points son obligatorios',
      });
    }

    const client = await ClientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un cliente con validación
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, points } = req.body;

    if (!name || !email || typeof points !== 'number') {
      return res.status(400).json({ error: 'Faltan campos requeridos o tipos inválidos' });
    }

    const existingClient = await ClientService.getClientById(req.params.id);
    if (!existingClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const updatedClient = await ClientService.updateClient(req.params.id, req.body);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;