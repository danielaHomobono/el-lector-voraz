const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    const user = await UserService.loginUser({ email, password });
    res.json({ message: 'Login exitoso', user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

module.exports = router;