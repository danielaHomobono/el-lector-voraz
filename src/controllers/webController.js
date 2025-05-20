// src/controllers/webController.js
  const cafeService = require('../services/cafeService');
  const productService = require('../services/productService');
  const clientService = require('../services/clientService');
  const saleService = require('../services/saleService');
  const userService = require('../services/userService');

  async function home(req, res) {
    res.render('index', { user: req.user });
  }

  async function loginPage(req, res) {
    res.render('login');
  }

  async function cafePage(req, res) {
    try {
      const cafes = await cafeService.getCafeProducts();
      res.render('cafes', { cafes, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar la lista de cafés', user: req.user });
    }
  }

  async function productPage(req, res) {
    try {
      const products = await productService.getProducts();
      res.render('products', { products, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar el catálogo de libros', user: req.user });
    }
  }

  async function clientPage(req, res) {
    try {
      const clients = await clientService.getClients();
      res.render('clientes', { clients, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar la lista de clientes', user: req.user });
    }
  }

  async function salesPage(req, res) {
    try {
      const sales = await saleService.getSales();
      res.render('sales', { sales, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar la lista de ventas', user: req.user });
    }
  }

  async function userPage(req, res) {
    try {
      const users = await userService.getUsers();
      res.render('users', { users, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar la lista de usuarios', user: req.user });
    }
  }

  async function inventoryPage(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).render('error', { message: 'Acceso denegado: Solo administradores', user: req.user });
      }
      const products = await productService.getProducts();
      const cafes = await cafeService.getCafeProducts();
      const inventory = {
        books: products.filter(p => p.type === 'book'),
        cafes
      };
      res.render('inventory', { inventory, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar el reporte de inventario', user: req.user });
    }
  }

  async function financialPage(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).render('error', { message: 'Acceso denegado: Solo administradores', user: req.user });
      }
      const sales = await saleService.getSales();
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      const report = {
        totalSales: sales.length,
        totalRevenue,
        sales
      };
      res.render('financial', { report, user: req.user });
    } catch (error) {
      res.render('error', { message: 'Error al cargar el reporte financiero', user: req.user });
    }
  }

  module.exports = { home, loginPage, cafePage, productPage, clientPage, salesPage, userPage, inventoryPage, financialPage };