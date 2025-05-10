const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(express.static('public'));

const productRoutes = require('./src/routes/productRoutes');
const cafeRoutes = require('./src/routes/cafeRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const authRoutes = require('./src/routes/authRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const marketingRoutes = require('./src/routes/marketingRoutes');

app.use('/api/products', productRoutes);
app.use('/api/cafe', cafeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/marketing', marketingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a El Lector Voraz API' });
});

app.get('/test-pug', (req, res) => {
  res.render('layout', { title: 'Prueba Pug', message: 'Pug está configurado correctamente' });
});

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