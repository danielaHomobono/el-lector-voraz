// src/services/userService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getUsers() {
    return await fileService.readFile('src/data/users.json');
  }

  async function createUser(userData) {
    const users = await getUsers();
    const newUser = {
      id: generateUUID(),
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    users.push(newUser);
    await fileService.writeFile('src/data/users.json', users);
    return newUser;
  }

  async function updateUser(id, userData) {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    users[index] = {
      id,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    await fileService.writeFile('src/data/users.json', users);
    return users[index];
  }

  async function deleteUser(id) {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    users.splice(index, 1);
    await fileService.writeFile('src/data/users.json', users);
  }

  module.exports = { getUsers, createUser, updateUser, deleteUser };