// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./src/config/passport');
const connectDB = require('./src/config/database');
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

const app = express();

// --- SOCKET.IO INTEGRACIÓN ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.set('io', io);
// --- FIN SOCKET.IO ---

// Conectar a MongoDB
connectDB();

// Configuración de vistas
app.set('view engine', 'pug');
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para pasar el usuario y la ruta actual a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.currentPath = req.path;
  next();
});

// Servir archivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


// --- SOCKET.IO CHAT SOPORTE ---
// Mapear sockets por usuario y tipo
const connectedUsers = {
  clients: new Map(),
  support: new Map()
};

io.on('connection', (socket) => {
  console.log('Nueva conexión Socket.IO:', socket.id);

  // Cliente se conecta
  socket.on('client_connect', (data) => {
    console.log('Cliente conectado:', data.username);
    
    // Validar y asegurar que username tenga un valor válido
    if (!data.username || data.username.trim() === '') {
      data.username = 'Cliente';
    }
    
    connectedUsers.clients.set(data.userId, {
      socket: socket,
      userData: data
    });
    
    // Notificar a todos los soportes
    connectedUsers.support.forEach((supportData, supportId) => {
      supportData.socket.emit('clients_update', {
        clients: Array.from(connectedUsers.clients.values()).map(client => ({
          id: client.userData.userId,
          username: client.userData.username || 'Cliente',
          online: true
        }))
      });
    });
  });

  // Soporte se conecta
  socket.on('support_connect', (data) => {
    console.log('Soporte conectado:', data.username);
    
    // Validar y asegurar que username tenga un valor válido
    if (!data.username || data.username.trim() === '') {
      data.username = 'Soporte';
    }
    
    connectedUsers.support.set(data.userId, {
      socket: socket,
      userData: data
    });
    
    // Enviar lista de clientes al soporte
    socket.emit('clients_update', {
      clients: Array.from(connectedUsers.clients.values()).map(client => ({
        id: client.userData.userId,
        username: client.userData.username || 'Cliente',
        online: true
      }))
    });
  });

  // Cliente envía mensaje
  socket.on('client_message', (data) => {
    console.log('Mensaje de cliente:', data.message);
    
    // Enviar a todos los soportes
    connectedUsers.support.forEach((supportData, supportId) => {
      supportData.socket.emit('client_message', {
        clientId: data.userId,
        username: data.username || 'Cliente',
        message: data.message,
        timestamp: new Date().toISOString()
      });
    });
  });

  // Soporte envía mensaje
  socket.on('support_message', (data) => {
    console.log('Mensaje de soporte recibido:', {
      message: data.message,
      clientId: data.clientId,
      supportId: data.supportId,
      supportName: data.supportName
    });
    
    // Enviar al cliente específico
    const clientData = connectedUsers.clients.get(data.clientId);
    if (clientData) {
      console.log('Enviando mensaje al cliente:', data.clientId);
      clientData.socket.emit('message_received', {
        message: data.message,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Cliente no encontrado:', data.clientId);
      console.log('Clientes conectados:', Array.from(connectedUsers.clients.keys()));
    }
  });

  // Cliente escribiendo
  socket.on('client_typing', (data) => {
    connectedUsers.support.forEach((supportData, supportId) => {
      supportData.socket.emit('client_typing', {
        clientId: data.userId
      });
    });
  });

  // Cliente deja de escribir
  socket.on('client_stop_typing', (data) => {
    connectedUsers.support.forEach((supportData, supportId) => {
      supportData.socket.emit('client_stop_typing', {
        clientId: data.userId
      });
    });
  });

  // Soporte escribiendo
  socket.on('support_typing', (data) => {
    const clientData = connectedUsers.clients.get(data.clientId);
    if (clientData) {
      clientData.socket.emit('typing_start');
    }
  });

  // Soporte deja de escribir
  socket.on('support_stop_typing', (data) => {
    const clientData = connectedUsers.clients.get(data.clientId);
    if (clientData) {
      clientData.socket.emit('typing_stop');
    }
  });

  // Finalizar chat
  socket.on('end_chat', (data) => {
    const clientData = connectedUsers.clients.get(data.clientId);
    if (clientData) {
      clientData.socket.emit('chat_ended');
    }
  });

  // Solicitar actualización de clientes
  socket.on('request_clients_update', () => {
    socket.emit('clients_update', {
      clients: Array.from(connectedUsers.clients.values()).map(client => ({
        id: client.userData.userId,
        username: client.userData.username || 'Cliente',
        online: true
      }))
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Desconexión Socket.IO:', socket.id);
    
    // Remover de clientes
    for (const [userId, clientData] of connectedUsers.clients.entries()) {
      if (clientData.socket.id === socket.id) {
        connectedUsers.clients.delete(userId);
        console.log('Cliente desconectado:', clientData.userData.username);
        break;
      }
    }
    
    // Remover de soporte
    for (const [userId, supportData] of connectedUsers.support.entries()) {
      if (supportData.socket.id === socket.id) {
        connectedUsers.support.delete(userId);
        console.log('Soporte desconectado:', supportData.userData.username);
        break;
      }
    }
    
    // Actualizar lista para todos los soportes
    connectedUsers.support.forEach((supportData, supportId) => {
      supportData.socket.emit('clients_update', {
        clients: Array.from(connectedUsers.clients.values()).map(client => ({
          id: client.userData.userId,
          username: client.userData.username || 'Cliente',
          online: true
        }))
      });
    });
  });
});
// --- FIN SOCKET.IO CHAT SOPORTE ---

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
    const productService = require('./src/services/productService');
    // Fetch books sorted alphabetically by title
    const products = await productService.getSortedBooks();
    console.log('Libros encontrados en MongoDB:', products.length);
    res.render('inventory', { title: 'Inventario de Libros', products, user: req.session.user, apiKey: process.env.API_KEY });
  } catch (error) {
    console.error('Error en /inventory:', error);
    res.status(500).send(`Error al cargar inventario: ${error.message}`);
  }
});

app.get('/products', async (req, res) => {
  try {
    // Check if user is logged in and has appropriate role
    if (!req.session.user) {
      return res.redirect('/login');
    }
    
    // Only allow staff and clients to access the catalog
    if (req.session.user.role !== 'staff' && req.session.user.role !== 'client') {
      return res.status(403).send('Acceso denegado: No tienes permiso para ver esta página');
    }
    
    console.log('Renderizando products.pug');
    if (!fs.existsSync(path.join(__dirname, 'views/products.pug'))) {
      throw new Error('products.pug no encontrado en views/');
    }
    const Product = require('./src/models/Product');
    const products = await Product.find({ type: 'book' }).sort({ title: 1 });
    res.render('products', { title: 'Catálogo de Libros', products, user: req.session.user });
  } catch (error) {
    console.error('Error en /products:', error);
    res.status(500).send(`Error al cargar productos: ${error.message}`);
  }
});

app.get('/clients', async (req, res) => {
  try {
    console.log('Renderizando clients.pug');
    const Client = require('./src/models/Client');
    // Sort clients alphabetically by name
    const clients = await Client.find().sort({ name: 1 });
    res.render('clients', { title: 'Clientes', clients, user: req.session.user, apiKey: process.env.API_KEY });
  } catch (error) {
    console.error('Error en /clients:', error);
    res.status(500).send(`Error al cargar clientes: ${error.message}`);
  }
});

app.get('/sales', async (req, res) => {
  try {
    // Check if user is logged in and has appropriate role
    if (!req.session.user) {
      return res.redirect('/login');
    }
    
    // Only allow admin and staff to access the sales page
    if (req.session.user.role !== 'admin' && req.session.user.role !== 'staff') {
      return res.status(403).send('Acceso denegado: No tienes permiso para ver esta página');
    }
    
    console.log('Renderizando sales.pug');
    const Sale = require('./src/models/Sale');
    const Product = require('./src/models/Product');
    const CafeProduct = require('./src/models/CafeProduct');
    const Client = require('./src/models/Client');
    const User = require('./src/models/User');
    
    // Get all sales sorted by creation date (newest first)
    // Using createdAt ensures we get the most recent sales even if date field is missing
    const sales = await Sale.find().sort({ createdAt: -1 }).lean();
    
    // Get all products, clients, and users for reference
    const products = await Product.find().lean();
    const cafeProducts = await CafeProduct.find().lean();
    const clients = await Client.find().lean();
    const users = await User.find().lean();
    
    // Create lookup maps
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = {
        name: product.title,
        type: 'book',
        price: product.price
      };
    });
    
    cafeProducts.forEach(cafe => {
      productMap[cafe._id] = {
        name: cafe.name,
        type: 'cafe',
        price: cafe.price
      };
    });
    
    const clientMap = {};
    clients.forEach(client => {
      clientMap[client._id] = {
        name: client.name,
        email: client.email,
        points: client.points || 0
      };
    });
    
    const userMap = {};
    users.forEach(user => {
      userMap[user._id] = user.email;
    });
    
    // Calculate summary statistics
    let totalRevenue = 0;
    let totalItems = 0;
    let bookSales = 0;
    let cafeSales = 0;
    
    // Enhance sales with product and client details
    sales.forEach(sale => {
      // Add client name and details
      if (sale.clientId && clientMap[sale.clientId]) {
        sale.clientName = clientMap[sale.clientId].name;
        sale.clientEmail = clientMap[sale.clientId].email;
        sale.clientPoints = clientMap[sale.clientId].points;
      }
      
      // Add staff/user who processed the sale
      if (sale.userId && userMap[sale.userId]) {
        sale.userEmail = userMap[sale.userId];
      }
      
      // Add product details to items and calculate totals
      let saleItemCount = 0;
      if (sale.items && sale.items.length > 0) {
        sale.items.forEach(item => {
          if (item.productId && productMap[item.productId]) {
            item.productName = productMap[item.productId].name;
            item.productType = productMap[item.productId].type;
            
            // Count items by type
            if (item.productType === 'book') {
              bookSales += item.quantity || 1;
            } else if (item.productType === 'cafe') {
              cafeSales += item.quantity || 1;
            }
            
            saleItemCount += item.quantity || 1;
          }
        });
      }
      
      // Add item count to sale
      sale.itemCount = saleItemCount;
      totalItems += saleItemCount;
      
      // Add to total revenue
      totalRevenue += sale.total || 0;
      
      // Ensure date is properly formatted
      if (!sale.date) {
        sale.date = sale.createdAt || new Date();
      }
    });
    
    // Calculate average sale value
    const averageSaleValue = sales.length > 0 ? totalRevenue / sales.length : 0;
    
    res.render('sales', { 
      title: 'Ventas', 
      sales,
      summary: {
        totalSales: sales.length,
        totalRevenue,
        totalItems,
        bookSales,
        cafeSales,
        averageSaleValue
      },
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error en /sales:', error);
    res.status(500).send(`Error al cargar ventas: ${error.message}`);
  }
});

app.get('/users', async (req, res) => {
  try {
    console.log('Renderizando users.pug');
    const User = require('./src/models/User');
    // Sort users alphabetically by email
    const users = await User.find().sort({ email: 1 });
    res.render('users', { title: 'Usuarios', users, user: req.session.user, apiKey: process.env.API_KEY });
  } catch (error) {
    console.error('Error en /users:', error);
    res.status(500).send(`Error al cargar usuarios: ${error.message}`);
  }
});

app.get('/financial', async (req, res) => {
  try {
    // Check if user is logged in and has appropriate role
    if (!req.session.user) {
      return res.redirect('/login');
    }
    
    // Only allow admin to access the financial reports
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado: No tienes permiso para ver esta página');
    }
    
    console.log('Renderizando financial.pug');
    const reportService = require('./src/services/reportService');
    const report = await reportService.generateSalesReport();
    
    // Add product types summary to the report
    if (report && report.report && report.report.length > 0) {
      const productTypes = {};
      
      report.report.forEach(day => {
        Object.entries(day.salesByType || {}).forEach(([type, count]) => {
          if (!productTypes[type]) {
            productTypes[type] = 0;
          }
          productTypes[type] += count;
        });
      });
      
      report.summary.productTypes = productTypes;
    }
    
    res.render('financial', { 
      title: 'Reporte Financiero', 
      report, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error en /financial-report:', error);
    res.status(500).send(`Error al generar el reporte financiero: ${error.message}`);
  }
});

// Stock route moved to webRoutes.js

app.get('/cart', (req, res) => {
  try {
    console.log('Renderizando cart.pug');
    res.render('cart', { title: 'Carrito de Compras', user: req.session.user });
  } catch (error) {
    console.error('Error en /cart:', error);
    res.status(500).send(`Error al cargar el carrito: ${error.message}`);
  }
});

app.get('/checkout', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
    console.log('Renderizando checkout.pug');
    res.render('checkout', { title: 'Finalizar Compra', user: req.session.user, apiKey: process.env.API_KEY });
  } catch (error) {
    console.error('Error en /checkout:', error);
    res.status(500).send(`Error al cargar la página de checkout: ${error.message}`);
  }
});

app.get('/confirmation', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
    console.log('Renderizando confirmation.pug');
    res.render('confirmation', { title: 'Confirmación de Compra', user: req.session.user });
  } catch (error) {
    console.error('Error en /confirmation:', error);
    res.status(500).send(`Error al cargar la página de confirmación: ${error.message}`);
  }
});

app.use('/', webRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).send('Cannot GET');
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});