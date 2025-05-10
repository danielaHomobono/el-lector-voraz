const express = require('express');
const router = express.Router();
const ClientService = require('../services/clientService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const clients = await ClientService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const client = await ClientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const client = await ClientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/redeem', authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    if (!points || points < 10 || points % 10 !== 0) {
      return res.status(400).json({ error: 'Los puntos deben ser al menos 10 y múltiplos de 10' });
    }
    const client = await ClientService.redeemPoints(req.params.id, points);
    res.json({ message: 'Puntos canjeados', client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;