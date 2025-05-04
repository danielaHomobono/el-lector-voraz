const express = require('express');
const router = express.Router();
const ProductService = require('../services/productService');
const authMiddleware = require('../middleware/authMiddleware');
const validateProduct = require('../middleware/validateProduct');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un producto
router.post('/', authMiddleware, validateProduct, async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un producto
router.put('/:id', authMiddleware, validateProduct, async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;