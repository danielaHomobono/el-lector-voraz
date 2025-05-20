// src/controllers/authController.js
const userService = require('../services/userService');
const { handleError } = require('../utils/errorHandler');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Intento de login para:', email);

    if (!email || !password) {
      console.log('Faltan credenciales');
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const users = await userService.getUsers();
    console.log('Usuarios disponibles:', users.map(u => u.email));

    // Buscar usuario (case insensitive)
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      console.log('Credenciales inválidas para:', email);
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Por favor, verifica tu email y contraseña'
      });
    }

    console.log('Login exitoso para:', user.email);
    req.session.user = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };

    // Devolver JSON para Thunder Client
    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Error en login:', error);
    handleError(res, error, 500);
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

module.exports = { login, logout };