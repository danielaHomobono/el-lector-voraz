const jwt = require('jsonwebtoken');

/**
 * Generates a JWT access token for a user
 * 
 * @param {Object} user - User object from database
 * @param {string} user._id - MongoDB ObjectId of the user
 * @param {string} user.email - Email of the user
 * @param {string} user.role - Role of the user (admin, staff, client)
 * @returns {string} JWT token
 */
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

/**
 * Generates a JWT refresh token for a user
 * 
 * @param {Object} user - User object from database
 * @param {string} user._id - MongoDB ObjectId of the user
 * @returns {string} JWT refresh token
 */
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

/**
 * Verifies a JWT token and returns the decoded payload
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'tu-jwt-secret');
  } catch (error) {
    throw new Error('Token inválido');
  }
};

/**
 * Extracts JWT token from Authorization header
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */
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