// src/routes/userRoutes.js
  const express = require('express');
  const router = express.Router();
  const userController = require('../controllers/userController');
  const authMiddleware = require('../middleware/authMiddleware');

  router.get('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, userController.getAllUsers);
  router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, userController.createUser);
  router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, userController.updateUser);
  router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, userController.deleteUser);

  module.exports = router;