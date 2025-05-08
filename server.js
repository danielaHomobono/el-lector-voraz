const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();

// Middleware para parsear solicitudes JSON
app.use(express.json());

// Configurar Pug como motor de vistas para futura integración del frontend
app.set('view engine', 'pug');
app.set('views', './views'); // Carpeta donde estarán las plantillas Pug

// Servir archivos estáticos (CSS, JS, imágenes) desde la carpeta public
app.use(express.static('public'));

// Importar rutas de la API
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

// Usar rutas con prefijo /api
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a El Lector Voraz API' });
});
// Ruta de prueba para verificar Pug
app.get('/test-pug', (req, res) => {
  res.render('layout', { title: 'Prueba Pug', message: 'Pug está configurado correctamente' });
});


// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno en el  del servidor' });
});

// Iniciar el servidor en el puerto definido en .env o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('¡Hola, Tech Moms 2.0!');
  });
  