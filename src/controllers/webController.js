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
    const CafeProduct = require('../models/CafeProduct');
    // Obtener todos los productos de café ordenados por fecha de creación descendente
    const cafes = await CafeProduct.find().sort({ createdAt: -1 });
    console.log('Cafés traídos de la base de datos:', cafes);
    res.render('cafes', {
      title: 'Inventario de Cafetería',
      cafes,
      user: req.session.user,
      apiKey: process.env.API_KEY || ''
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function inventoryPage(req, res) {
  try {
    const productService = require('../services/productService');
    const CafeProduct = require('../models/CafeProduct');
    const products = await productService.getProducts();
    const cafes = await CafeProduct.find().sort({ createdAt: -1 });
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
    const Client = require('../models/Client');
    const clients = await Client.find().sort({ createdAt: -1 });
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
    const Sale = require('../models/Sale');
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.render('sales', {
      title: 'Ventas',
      sales,
      apiKey: process.env.API_KEY || ''
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function usersPage(req, res) {
  try {
    const User = require('../models/User');
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users', { 
      title: 'Usuarios',
      users,
      user: req.session.user
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function cartPage(req, res) {
  res.render('cart', { title: 'Carrito', user: req.session.user });
}

async function checkoutPage(req, res) {
  res.render('checkout', { title: 'Finalizar Compra', user: req.session.user, apiKey: process.env.API_KEY || '' });
}

async function stockPage(req, res) {
  try {
    // const CafeStock = require('../models/CafeStock');
    // const stockItems = await CafeStock.find().sort({ name: 1 });
    res.render('stock', { 
      title: 'Inventario de Cafetería',
      stockItems: [],
      user: req.session.user,
      apiKey: process.env.API_KEY || ''
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function chatPage(req, res) {
  try {
    // Preparar datos del usuario para el frontend
    const userData = {
      id: req.session.user._id,
      username: req.session.user.username,
      role: req.session.user.role
    };

    res.render('chat', { 
      title: 'Chat de Soporte',
      user: req.session.user,
      userData: JSON.stringify(userData)
    });
  } catch (error) {
    handleError(res, error, 500);
  }
}

async function supportPage(req, res) {
  try {
    // Preparar datos del usuario para el frontend
    const userData = {
      id: req.session.user._id,
      username: req.session.user.username,
      role: req.session.user.role
    };

    res.render('support', { 
      title: 'Panel de Soporte',
      user: req.session.user,
      userData: JSON.stringify(userData)
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
  usersPage,
  cartPage,
  checkoutPage,
  stockPage,
  chatPage,
  supportPage
};