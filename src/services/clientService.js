const FileService = require('./fileService');
const Client = require('../models/Client');

class ClientService {
  static async getAllClients() {
    return await FileService.readFile('clients.json');
  }

  static async getClientById(id) {
    const clients = await this.getAllClients();
    return clients.find((client) => client.id === id);
  }

  static async createClient(data) {
    const clients = await this.getAllClients();
    const newClient = new Client(data.name, data.email);
    clients.push(newClient);
    await FileService.writeFile('clients.json', clients);
    return newClient;
  }

  static async updateClient(id, data) {
    const clients = await this.getAllClients();
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    clients[index] = { ...clients[index], ...data };
    await FileService.writeFile('clients.json', clients);
    return clients[index];
  }
}

module.exports = ClientService;