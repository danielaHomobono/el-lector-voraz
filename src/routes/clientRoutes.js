const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/redeem', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const { points } = req.body;
    const client = await clientService.redeemPoints(req.params.id, points);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;