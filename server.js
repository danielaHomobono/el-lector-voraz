const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const ProductService = require('./src/services/productService');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();

// Middleware para parsear solicitudes JSON
app.use(express.json());

// Configurar Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static('public'));

// Rutas API
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const webRoutes = require('./src/routes/webRoutes');
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/', webRoutes); // Montar las rutas web sin prefijo

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
