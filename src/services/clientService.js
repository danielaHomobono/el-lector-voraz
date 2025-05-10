const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fileService = require('./fileService');
const Client = require('../models/Client');

const CLIENTS_FILE = path.resolve(__dirname, '..', 'data', 'clients.json');

async function getAllClients() {
  return await fileService.readFile(CLIENTS_FILE);
}

async function getClientById(id) {
  const clients = await getAllClients();
  const client = clients.find(c => c.id === id);
  if (!client) throw new Error('Cliente no encontrado');
  return client;
}

async function createClient(data) {
  const clients = await getAllClients();
  const client = new Client({ id: uuidv4(), ...data });
  clients.push(client);
  await fileService.writeFile(CLIENTS_FILE, clients);
  return client;
}

async function updateClient(id, data) {
  const clients = await getAllClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cliente no encontrado');
  clients[index] = { ...clients[index], ...data };
  await fileService.writeFile(CLIENTS_FILE, clients);
  return clients[index];
}

async function redeemPoints(id, points) {
  const clients = await getAllClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cliente no encontrado');
  const client = new Client(clients[index]);
  client.redeemPoints(points);
  clients[index] = client;
  await fileService.writeFile(CLIENTS_FILE, clients);
  return clients[index];
}

module.exports = { getAllClients, getClientById, createClient, updateClient, redeemPoints };