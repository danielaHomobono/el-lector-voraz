// src/services/clientService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getClients() {
    return await fileService.readFile('src/data/clients.json');
  }

  async function createClient(clientData) {
    const clients = await getClients();
    const newClient = {
      id: generateUUID(),
      name: clientData.name,
      email: clientData.email,
      points: clientData.points
    };
    clients.push(newClient);
    await fileService.writeFile('src/data/clients.json', clients);
    return newClient;
  }

  async function updateClient(id, clientData) {
    const clients = await getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    clients[index] = {
      id,
      name: clientData.name,
      email: clientData.email,
      points: clientData.points
    };
    await fileService.writeFile('src/data/clients.json', clients);
    return clients[index];
  }

  async function deleteClient(id) {
    const clients = await getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    clients.splice(index, 1);
    await fileService.writeFile('src/data/clients.json', clients);
  }

  module.exports = { getClients, createClient, updateClient, deleteClient };