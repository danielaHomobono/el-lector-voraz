// src/controllers/productController.js
  const productService = require('../services/productService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllProducts(req, res) {
    try {
      const products = await productService.getProducts();
      res.json(products);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createProduct(req, res) {
    try {
      const productData = req.body;
      if (!productData.title || !productData.author || !productData.isbn || !productData.price || !productData.stock) {
        return res.status(400).json({ error: 'Título, autor, ISBN, precio y stock son requeridos' });
      }
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      if (!productData.title || !productData.author || !productData.isbn || !productData.price || !productData.stock) {
        return res.status(400).json({ error: 'Título, autor, ISBN, precio y stock son requeridos' });
      }
      const updatedProduct = await productService.updateProduct(id, productData);
      res.json(updatedProduct);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };