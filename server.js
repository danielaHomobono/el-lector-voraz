// server.js
const express = require('express');
const session = require('express-session');
const productRoutes = require('./src/routes/productRoutes');
const cafeRoutes = require('./src/routes/cafeRoutes');
const userRoutes = require('./src/routes/userRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const marketingRoutes = require('./src/routes/marketingRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const authRoutes = require('./src/routes/authRoutes');
const authController = require('./src/controllers/authController');
const fileService = require('./src/services/fileService');
const path = require('path');
const fs = require('fs');
const webRoutes = require('./src/routes/webRoutes');
require('dotenv').config();

const app = express();

// Configuración de vistas
app.set('view engine', 'pug');
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
console.log('Directorio de vistas configurado:', viewsPath);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Servir archivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
console.log('Archivos estáticos servidos desde:', publicPath);

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cafe', cafeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ventas', saleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/reports', reportRoutes);

// Rutas de vistas
app.get('/', (req, res) => {
  console.log('Renderizando index.pug');
  res.render('index', { title: 'El Lector Voraz' });
});

// Ruta de login
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Iniciar Sesión', error: null });
});

app.get('/inventory', async (req, res) => {
  try {
    console.log('Renderizando inventory.pug');
    const products = await fileService.readFile('src/data/products.json');
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    res.render('inventory', { title: 'Inventario', products, cafes, user: req.session.user });
  } catch (error) {
    console.error('Error en /inventory:', error);
    res.status(500).send(`Error al cargar inventario: ${error.message}`);
  }
});

app.get('/products', async (req, res) => {
  try {
    console.log('Renderizando products.pug');
    if (!fs.existsSync(path.join(__dirname, 'views/products.pug'))) {
      throw new Error('products.pug no encontrado en views/');
    }
    const products = await fileService.readFile('src/data/products.json');
    res.render('products', { title: 'Catálogo de Libros', products, user: req.session.user });
  } catch (error) {
    console.error('Error en /products:', error);
    res.status(500).send(`Error al cargar productos: ${error.message}`);
  }
});

app.get('/cafes', async (req, res) => {
  try {
    console.log('Renderizando cafes.pug');
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    res.render('cafes', { title: 'Cafetería', cafes, user: req.session.user });
  } catch (error) {
    console.error('Error en /cafes:', error);
    res.status(500).send(`Error al cargar cafés: ${error.message}`);
  }
});

app.get('/clients', async (req, res) => {
  try {
    console.log('Renderizando clients.pug');
    const clients = await fileService.readFile('src/data/clients.json');
    res.render('clients', { title: 'Clientes', clients, user: req.session.user });
  } catch (error) {
    console.error('Error en /clients:', error);
    res.status(500).send(`Error al cargar clientes: ${error.message}`);
  }
});

app.get('/sales', async (req, res) => {
  try {
    console.log('Renderizando sales.pug');
    const sales = await fileService.readFile('src/data/sales.json');
    res.render('sales', { title: 'Ventas', sales, user: req.session.user });
  } catch (error) {
    console.error('Error en /sales:', error);
    res.status(500).send(`Error al cargar ventas: ${error.message}`);
  }
});

app.get('/users', async (req, res) => {
  try {
    console.log('Renderizando users.pug');
    const users = await fileService.readFile('src/data/users.json');
    res.render('users', { title: 'Usuarios', users, user: req.session.user });
  } catch (error) {
    console.error('Error en /users:', error);
    res.status(500).send(`Error al cargar usuarios: ${error.message}`);
  }
});

app.get('/financial', async (req, res) => {
  try {
    console.log('Renderizando financial.pug');
    const reportService = require('./src/services/reportService');
    const report = await reportService.generateSalesReport();
    res.render('financial', { title: 'Reporte Financiero', report, user: req.session.user });
  } catch (error) {
    console.error('Error en /financial-report:', error);
    res.status(500).send(`Error al generar el reporte financiero: ${error.message}`);
  }
});

app.use('/', webRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).send('Cannot GET');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});