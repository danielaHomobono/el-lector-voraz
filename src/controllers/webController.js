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
    const CafeStock = require('../models/CafeStock');
    
    // Get cafe products
    const cafes = await CafeProduct.find().sort({ createdAt: -1 });
    
    // Get stock items
    const stockItems = await CafeStock.find();
    
    // Create a map of stock items by name for quick lookup
    const stockMap = {};
    stockItems.forEach(item => {
      stockMap[item.name.toLowerCase()] = item;
    });
    
    // Add stock information to cafe products
    cafes.forEach(cafe => {
      // Try to find matching stock item by name
      const stockItem = stockMap[cafe.name.toLowerCase()] || 
                        stockItems.find(item => item.name.toLowerCase().includes(cafe.name.toLowerCase()) || 
                                              cafe.name.toLowerCase().includes(item.name.toLowerCase()));
      
      // If found, use its quantity as stock
      if (stockItem) {
        cafe.stock = stockItem.quantity;
        cafe.stockUnit = stockItem.unit;
        cafe.lowStockThreshold = stockItem.minStock;
      } else {
        // Default values if no stock item found
        cafe.stock = 10;
        cafe.stockUnit = 'unidades';
        cafe.lowStockThreshold = 5;
      }
    });
    
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
  res.render('checkout', { title: 'Finalizar Compra', user: req.session.user, apiKey: process.env.API_KEY });
}

async function stockPage(req, res) {
  try {
    const CafeStock = require('../models/CafeStock');
    const stockItems = await CafeStock.find().sort({ name: 1 });
    res.render('stock', { 
      title: 'Inventario de Cafetería',
      stockItems,
      user: req.session.user,
      apiKey: process.env.API_KEY
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
  stockPage
};