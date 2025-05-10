
const { v4: uuidv4 } = require('uuid');

class Client {
  constructor({ id, name, email, points = 0 }) {
    if (!name || !email) throw new Error('Faltan campos requeridos');
    this.id = id;
    this.name = name;
    this.email = email;
    this.points = points;
  }

  addPoints(points) {
    this.points += points;
  }

  redeemPoints(points) {
    if (this.points < points) throw new Error('Puntos insuficientes');
    this.points -= points;
  }
}

module.exports = Client;