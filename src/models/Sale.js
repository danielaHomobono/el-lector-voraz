const { v4: uuidv4 } = require('uuid');

class Sale {
  constructor({ id, clientId, items, total, date, channel }) {
    if (!items || !total || !date || !channel) throw new Error('Faltan campos requeridos');
    this.id = id;
    this.clientId = clientId;
    this.items = items;
    this.total = total;
    this.date = date;
    this.channel = channel;
  }
}

module.exports = Sale;