const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

const ProductService = require('./src/services/productService');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cafeRoutes = require('./src/routes/cafeRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const marketingRoutes = require('./src/routes/marketingRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const webRoutes = require('./src/routes/webRoutes');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurar sesión
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware global para asignar req.user desde req.session.user
app.use((req, res, next) => {
  console.log('Middleware global: req.session.user =', req.session.user);
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Configurar Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static('public'));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cafe', cafeRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/', webRoutes); // Rutas web

// Vista de prueba Pug
app.get('/test-pug', (req, res) => {
  res.render('layout', { title: 'Prueba Pug', message: 'Pug está configurado correctamente' });
});

// Vista de catálogo con Pug
app.get('/catalogo', async (req, res) => {
  try {
    const all = await ProductService.getAllProducts();
    const books = all.filter(p => p.type === 'book');
    res.render('products', { products: books });
  } catch (error) {
    res.status(500).send('Error al cargar el catálogo');
  }
});

// Inicio
app.get('/', (req, res) => {
  res.send('¡Hola, Tech Moms 2.0!');
});

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
