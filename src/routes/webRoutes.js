const express = require('express');
const router = express.Router();
const ProductService = require('../services/productService');

router.get('/catalogo', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    const books = products.filter(p => p.type === 'book');
    res.render('products', { products: books });
  } catch (error) {
    res.status(500).send('Error al cargar el catálogo');
  }
});

module.exports = router;
