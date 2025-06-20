// src/controllers/userController.js
  const userService = require('../services/userService');
  const { handleError } = require('../utils/errorHandler');

  async function getAllUsers(req, res) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error) {
      handleError(res, error, 500);
    }
  }

  async function createUser(req, res) {
    try {
      const userData = req.body;
      if (!userData.email || !userData.password || !userData.role) {
        return res.status(400).json({ error: 'Email, contraseña y rol son requeridos' });
      }
      if (!['admin', 'client', 'staff'].includes(userData.role)) {
        return res.status(400).json({ error: 'Rol debe ser "admin", "client" o "staff"' });
      }
      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      // Para actualización, email y rol son requeridos, pero contraseña es opcional
      if (!userData.email || !userData.role) {
        return res.status(400).json({ error: 'Email y rol son requeridos' });
      }
      
      if (!['admin', 'client', 'staff'].includes(userData.role)) {
        return res.status(400).json({ error: 'Rol debe ser "admin", "client" o "staff"' });
      }
      
      // Si la contraseña está vacía, la removemos del objeto para no actualizarla
      if (!userData.password || userData.password.trim() === '') {
        delete userData.password;
      }
      
      const updatedUser = await userService.updateUser(id, userData);
      res.json(updatedUser);
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  async function deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      handleError(res, error, 400);
    }
  }

  module.exports = { getAllUsers, createUser, updateUser, deleteUser };