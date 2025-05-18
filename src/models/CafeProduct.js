const { v4: uuidv4 } = require('uuid');

class CafeProduct {
  constructor({ id, name, price, stock, category }) {
    if (!name || !price || !stock || !category) throw new Error('Faltan campos requeridos');
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  updateStock(quantity) {
    if (this.stock < quantity) throw new Error('Stock insuficiente');
    this.stock -= quantity;
  }
}

module.exports = CafeProduct;