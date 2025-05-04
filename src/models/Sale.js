const { v4: uuidv4 } = require('uuid');

class Sale {
  constructor(productId, clientId, quantity, total) {
    this.id = uuidv4();
    this.productId = productId;
    this.clientId = clientId;
    this.quantity = quantity;
    this.total = total;
    this.date = new Date().toISOString();
  }
}

module.exports = Sale;