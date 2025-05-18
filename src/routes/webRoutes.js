const express = require('express');
const router = express.Router();

const ProductService = require('../services/productService');
const CafeService = require('../services/cafeService');
const ClientService = require('../services/clientService');
const SaleService = require('../services/saleService');

// Libros
router.get('/catalogo', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    const books = products.filter(p => p.type === 'book');
    res.render('products', { products: books });
  } catch (error) {
    console.error('Error en /catalogo:', error);
    res.status(500).render('error', { message: 'Error al cargar el catálogo' });
  }
});

// Cafés
router.get('/cafes', async (req, res) => {
  try {
    const cafes = await CafeService.getAllCafes();
    res.render('cafes', { cafes });
  } catch (error) {
    console.error('Error en /cafes:', error);
    res.status(500).render('error', { message: 'Error al cargar el catálogo de bebidas' });
  }
});

// Clientes (solo autenticados)
router.get('/clientes', async (req, res) => {
  try {
    const clients = await ClientService.getAllClients();
    res.render('clients', { clients });
  } catch (error) {
    console.error('Error en /clientes:', error);
    res.status(500).render('error', { message: 'Error al cargar el listado de clientes' });
  }
});

// Ventas
router.get('/ventas', async (req, res) => {
  try {
    const sales = await SaleService.getAllSales();
    res.render('sales', { sales });
  } catch (error) {
    console.error('Error en /ventas:', error);
    res.status(500).render('error', { message: 'Error al cargar el catálogo de ventas' });
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
