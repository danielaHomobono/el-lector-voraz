const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o contraseña' });
    }
    const user = await userService.loginUser({ email, password });
    console.log('Usuario autenticado:', user);
    req.session.user = user;
    console.log('Sesión configurada:', req.session.user);
    res.json({ message: 'Login exitoso', user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout exitoso' });
});

module.exports = router;