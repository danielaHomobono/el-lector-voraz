const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileService = require('./fileService');

const CLIENTS_FILE = path.resolve(__dirname, '..', 'data', 'clients.json');

async function getAllClients() {
  return await fileService.readFile(CLIENTS_FILE);
}

async function createClient(data) {
  const clients = await fileService.readFile(CLIENTS_FILE);
  const client = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    points: data.points || 0
  };
  if (!client.name || !client.email) {
    throw new Error('Faltan campos requeridos');
  }
  clients.push(client);
  await fileService.writeFile(CLIENTS_FILE, clients);
  return client;
}

async function updateClient(id, data) {
  const clients = await fileService.readFile(CLIENTS_FILE);
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Cliente no encontrado');
  }
  const updatedClient = { ...clients[index], ...data, id };
  if (!updatedClient.name || !updatedClient.email) {
    throw new Error('Faltan campos requeridos');
  }
  clients[index] = updatedClient;
  await fileService.writeFile(CLIENTS_FILE, clients);
  return updatedClient;
}

async function redeemPoints(id, points) {
  const clients = await fileService.readFile(CLIENTS_FILE);
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Cliente no encontrado');
  }
  const client = clients[index];
  if (client.points < points) {
    throw new Error('Puntos insuficientes');
  }
  client.points -= points;
  clients[index] = client;
  await fileService.writeFile(CLIENTS_FILE, clients);
  return client;
}

module.exports = { getAllClients, createClient, updateClient, redeemPoints };