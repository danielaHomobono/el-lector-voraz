// src/middleware/authMiddleware.js
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-voraz-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Clave API inválida' });
  }
  next();
};

const restrictToAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Solo administradores' });
  }
  next();
};

const restrictToStaff = (req, res, next) => {
  if (!req.session.user || !['admin', 'staff'].includes(req.session.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado: Solo personal autorizado' });
  }
  next();
};

// Middleware para proteger rutas web
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Middleware para proteger rutas web de admin
const requireAdmin = (req, res, next) => {
  console.log('DEBUG requireAdmin - req.session:', req.session);
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { 
      title: 'Acceso Denegado',
      message: 'Solo los administradores pueden acceder a esta página'
    });
  }
  next();
};

// Middleware para proteger rutas web de staff
const requireStaff = (req, res, next) => {
  if (!req.session.user || !['admin', 'staff'].includes(req.session.user.role)) {
    return res.status(403).render('error', { 
      title: 'Acceso Denegado',
      message: 'Solo el personal autorizado puede acceder a esta página'
    });
  }
  next();
};

module.exports = { 
  verifyApiKey, 
  restrictToAdmin, 
  restrictToStaff, 
  requireAuth, 
  requireAdmin, 
  requireStaff 
};