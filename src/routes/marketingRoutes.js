const express = require('express');
const router = express.Router();
const marketingService = require('../services/marketingService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const posts = await marketingService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/posts', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const post = await marketingService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;