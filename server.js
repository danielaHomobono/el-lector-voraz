const express = require('express');
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cafeRoutes = require('./src/routes/cafeRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const marketingRoutes = require('./src/routes/marketingRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
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

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cafe', cafeRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});