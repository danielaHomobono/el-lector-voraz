// src/services/clientService.js
const Client = require('../models/Client');
const { generateUUID } = require('../utils/uuid');

async function getClients() {
  return await Client.find();
}

async function createClient(clientData) {
  const newClient = new Client({
    id: generateUUID(),
    name: clientData.name,
    email: clientData.email,
    points: clientData.points || 0,
    phone: clientData.phone || null
  });
  return await newClient.save();
}

async function updateClient(id, clientData) {
  const updatedClient = await Client.findOneAndUpdate(
    { id },
    {
      name: clientData.name,
      email: clientData.email,
      points: clientData.points || 0,
      phone: clientData.phone || null
    },
    { new: true }
  );
  if (!updatedClient) throw new Error('Cliente no encontrado');
  return updatedClient;
}

async function deleteClient(id) {
  const deleted = await Client.findOneAndDelete({ id });
  if (!deleted) throw new Error('Cliente no encontrado');
  return deleted;
}

module.exports = { getClients, createClient, updateClient, deleteClient };