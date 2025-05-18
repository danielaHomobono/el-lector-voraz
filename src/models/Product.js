const { v4: uuidv4 } = require('uuid');

class Product {
  constructor({ id, type, title, author, isbn, price, stock, category, consignment = false }) {
    if (!title || !price || !stock || !category) throw new Error('Faltan campos requeridos');
    if (type === 'book' && (!author || !isbn)) throw new Error('Autor e ISBN requeridos para libros');
    this.id = id;
    this.type = type; // "book" | "magazine"
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.consignment = consignment;
  }

  updateStock(quantity) {
    if (this.stock < quantity) throw new Error('Stock insuficiente');
    this.stock -= quantity;
  }
}

module.exports = Product;