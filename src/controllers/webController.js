// src/controllers/webController.js
const productService = require('../services/productService');
const fileService = require('../services/fileService');
const { handleError } = require('../utils/errorHandler');

async function loginPage(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Iniciar Sesión', error: null });
}

async function homePage(req, res) {
  try {
    res.render('index', { 
      title: 'Inicio',
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function productsPage(req, res) {
  try {
    const products = await productService.getProducts();
    res.render('products', { 
      title: 'Catálogo de Libros',
      products,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function cafesPage(req, res) {
  try {
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    res.render('cafes', { 
      title: 'Cafetería',
      cafes,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function inventoryPage(req, res) {
  try {
    const products = await productService.getProducts();
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    res.render('inventory', { 
      title: 'Inventario',
      products,
      cafes,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function clientsPage(req, res) {
  try {
    const clients = await fileService.readFile('src/data/clients.json');
    res.render('clients', { 
      title: 'Clientes',
      clients,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function salesPage(req, res) {
  try {
    const sales = await fileService.readFile('src/data/sales.json');
    res.render('sales', { 
      title: 'Ventas',
      sales,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function usersPage(req, res) {
  try {
    const users = await fileService.readFile('src/data/users.json');
    res.render('users', { 
      title: 'Usuarios',
      users,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

module.exports = {
  loginPage,
  homePage,
  productsPage,
  cafesPage,
  inventoryPage,
  clientsPage,
  salesPage,
  usersPage
};