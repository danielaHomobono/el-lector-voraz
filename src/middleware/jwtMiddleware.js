const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

// Middleware para verificar JWT token
const authenticateJWT = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar rol de admin con JWT
const requireAdminJWT = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Solo administradores' });
  }
  next();
};

// Middleware para verificar rol de staff con JWT
const requireStaffJWT = (req, res, next) => {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado: Solo personal autorizado' });
  }
  next();
};

module.exports = {
  authenticateJWT,
  requireAdminJWT,
  requireStaffJWT
}; 