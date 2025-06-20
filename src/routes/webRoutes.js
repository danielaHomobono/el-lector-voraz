// src/routes/webRoutes.js
const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/login', webController.loginPage);
router.get('/products', webController.productsPage);

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware.requireAuth, webController.homePage);
router.get('/cart', authMiddleware.requireAuth, (req, res, next) => {
  if (req.session.user && req.session.user.role === 'client') {
    return webController.cartPage(req, res, next);
  }
  return res.status(403).render('error', { title: 'Acceso Denegado', message: 'Solo clientes pueden acceder al carrito' });
});
router.get('/checkout', authMiddleware.requireAuth, (req, res, next) => {
  if (req.session.user && req.session.user.role === 'client') {
    return webController.checkoutPage(req, res, next);
  }
  return res.status(403).render('error', { title: 'Acceso Denegado', message: 'Solo clientes pueden finalizar compras' });
});

// Cafetería solo para staff y admin
router.get('/cafes', authMiddleware.requireAuth, webController.cafesPage);

// Rutas del chat
router.get('/chat', authMiddleware.requireAuth, (req, res, next) => {
  if (req.session.user && req.session.user.role === 'client') {
    return webController.chatPage(req, res, next);
  }
  return res.status(403).render('error', { title: 'Acceso Denegado', message: 'Solo clientes pueden acceder al chat de soporte' });
});

router.get('/support', authMiddleware.requireAuth, (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'staff')) {
    return webController.supportPage(req, res, next);
  }
  return res.status(403).render('error', { title: 'Acceso Denegado', message: 'Solo administradores y staff pueden acceder al panel de soporte' });
});

// Rutas de administrador
router.get('/inventory', authMiddleware.requireAdmin, webController.inventoryPage);
router.get('/clients', authMiddleware.requireAdmin, webController.clientsPage);
router.get('/sales', authMiddleware.requireAdmin, webController.salesPage);
router.get('/users', authMiddleware.requireAdmin, webController.usersPage);
router.get('/stock', authMiddleware.requireAdmin, webController.stockPage);

// Ruta de logout para la web
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Ruta para obtener configuración del cliente
router.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.API_KEY || ''
  });
});

module.exports = router;