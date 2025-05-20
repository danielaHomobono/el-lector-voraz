// src/routes/marketingRoutes.js
  const express = require('express');
  const router = express.Router();
  const marketingController = require('../controllers/marketingController');
  const authMiddleware = require('../middleware/authMiddleware');

  router.get('/posts', marketingController.getAllPosts);
  router.post('/posts', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, marketingController.createPost);
  router.put('/posts/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, marketingController.updatePost);
  router.delete('/posts/:id', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, marketingController.deletePost);

  module.exports = router;