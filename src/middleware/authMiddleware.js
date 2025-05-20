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

  module.exports = { verifyApiKey, restrictToAdmin };