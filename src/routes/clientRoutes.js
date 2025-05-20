// src/routes/clientRoutes.js
  const express = require('express');
  const router = express.Router();
  const clientController = require('../controllers/clientController');
  const authMiddleware = require('../middleware/authMiddleware');

  router.get('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, clientController.getAllClients);
  router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, clientController.createClient);
  router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, clientController.updateClient);
  router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, clientController.deleteClient);

  module.exports = router;