const express = require('express');
const router = express.Router();
const MarketingService = require('../services/marketingService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await MarketingService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { platform, content } = req.body;
    if (!platform || !content) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const post = await MarketingService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;