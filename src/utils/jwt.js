const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const options = {
    expiresIn: '24h' // Token expira en 24 horas
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'tu-jwt-secret', options);
};

// Generar refresh token
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    type: 'refresh'
  };

  const options = {
    expiresIn: '7d' // Refresh token expira en 7 días
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'tu-jwt-secret', options);
};

// Verificar token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'tu-jwt-secret');
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// Extraer token del header Authorization
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remover 'Bearer ' del inicio
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  extractTokenFromHeader
}; 