// src/services/userService.js
const User = require('../models/User');
const { generateUUID } = require('../utils/uuid');

async function getUsers() {
  try {
    return await User.find({});
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    return await User.findOne({ id });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    return await User.findOne({ email: email.toLowerCase() });
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    const newUser = new User({
      id: generateUUID(),
      email: userData.email,
      password: userData.password, // El modelo se encarga de hashearla
      role: userData.role || 'user',
      isActive: true
    });
    return await newUser.save();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

async function updateUser(id, userData) {
  try {
    const user = await User.findOneAndUpdate(
      { id },
      { 
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      },
      { new: true }
    );
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const result = await User.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new Error('Usuario no encontrado');
    }
    return result;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

module.exports = { 
  getUsers, 
  getUserById, 
  getUserByEmail,
  createUser, 
  updateUser, 
  deleteUser 
};