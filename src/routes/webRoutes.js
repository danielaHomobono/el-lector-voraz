// src/routes/webRoutes.js
const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/login', webController.loginPage);

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware.requireAuth, webController.homePage);
router.get('/products', authMiddleware.requireAuth, webController.productsPage);
router.get('/cafes', authMiddleware.requireAuth, webController.cafesPage);

// Rutas de administrador
router.get('/clients', authMiddleware.requireAdmin, webController.clientsPage);
router.get('/sales', authMiddleware.requireAdmin, webController.salesPage);
router.get('/users', authMiddleware.requireAdmin, webController.usersPage);

// Ruta de logout para la web
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;