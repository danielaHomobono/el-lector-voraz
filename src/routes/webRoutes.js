// src/routes/webRoutes.js
     const express = require('express');
     const router = express.Router();
     const webController = require('../controllers/webController');

     router.get('/', webController.home);
     router.get('/login', webController.loginPage);
     router.get('/cafes', webController.cafePage);
     router.get('/products', webController.productPage);
     router.get('/clients', webController.clientPage);
     router.get('/sales', webController.salesPage);
     router.get('/users', webController.userPage);

     module.exports = router;