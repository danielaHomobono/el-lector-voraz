// src/controllers/marketingController.js
  const marketingService = require('../services/marketingService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllPosts(req, res) {
    try {
      const posts = await marketingService.getPosts();
      res.json(posts);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createPost(req, res) {
    try {
      const postData = req.body;
      if (!postData.title || !postData.content) {
        return res.status(400).json({ error: 'Título y contenido son requeridos' });
      }
      const newPost = await marketingService.createPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updatePost(req, res) {
    try {
      const { id } = req.params;
      const postData = req.body;
      if (!postData.title || !postData.content) {
        return res.status(400).json({ error: 'Título y contenido son requeridos' });
      }
      const updatedPost = await marketingService.updatePost(id, postData);
      res.json(updatedPost);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deletePost(req, res) {
    try {
      const { id } = req.params;
      await marketingService.deletePost(id);
      res.json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllPosts, createPost, updatePost, deletePost };