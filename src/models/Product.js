const { v4: uuidv4 } = require('uuid');

class Product {
  constructor({ type, title, author, isbn, name, price, stock, category }) {
    this.id = uuidv4();
    this.type = type; // 'book' o 'cafe'
    this.title = title || null;
    this.author = author || null;
    this.isbn = isbn || null;
    this.name = name || null;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  // Actualiza el stock y valida disponibilidad
  updateStock(quantity) {
    if (this.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
  }
}

module.exports = Product;