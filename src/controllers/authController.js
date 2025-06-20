// src/controllers/authController.js
const userService = require('../services/userService');
const { handleError } = require('../utils/errorHandler');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Intento de login para:', email);

    if (!email || !password) {
      console.log('Faltan credenciales');
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const user = await userService.getUserByEmail(email);

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Por favor, verifica tu email y contraseña'
      });
    }

    // Verificar contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Contraseña incorrecta para:', email);
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Por favor, verifica tu email y contraseña'
      });
    }

    console.log('Login exitoso para:', user.email);
    
    // Crear sesión
    req.session.user = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    // Guardar la sesión explícitamente
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
      } else {
        console.log('Sesión guardada correctamente para:', user.email);
      }
    });

    // Generar tokens JWT
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Devolver respuesta con tokens
    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error en login:', error);
    handleError(res, error, 500);
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token es requerido' });
    }

    // Verificar refresh token
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Obtener usuario
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Generar nuevo access token
    const newAccessToken = generateToken(user);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    handleError(res, error, 401);
  }
}

async function logout(req, res) {
  try {
    console.log('Intento de logout para usuario:', req.session.user?.email);
    
    // Verificar si es una petición API
    const isApiRequest = req.originalUrl.startsWith('/api/');

    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      
      console.log('Sesión cerrada exitosamente');
      
      if (isApiRequest) {
        return res.status(200).json({ 
          success: true,
          message: 'Sesión cerrada exitosamente' 
        });
      }
      
      // Si es una petición web, redirigir al login
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ error: 'Error al cerrar sesión' });
  }
}

module.exports = { login, logout, refreshToken };