const { v4: uuidv4 } = require('uuid');

class Client {
  constructor(name, email) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.points = 0;
  }

  // Agrega puntos al cliente
  addPoints(amount) {
    this.points += amount;
  }
}

module.exports = Client;