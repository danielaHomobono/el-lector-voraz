// src/routes/cafeRoutes.js
  const express = require('express');
  const router = express.Router();
  const cafeController = require('../controllers/cafeController');
  const authMiddleware = require('../middleware/authMiddleware');

  router.get('/', cafeController.getAllCafes);
  router.post('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, cafeController.createCafe);
  router.put('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, cafeController.updateCafe);
  router.delete('/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, cafeController.deleteCafe);

  module.exports = router;