// src/services/productService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getProducts() {
    const books = await fileService.readFile('src/data/products.json');
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    return [...books, ...cafes];
  }

  async function createProduct(productData) {
    if (productData.type === 'cafe') {
      const cafes = await fileService.readFile('src/data/cafe_products.json');
      const newCafe = {
        id: generateUUID(),
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || 'Bebida'
      };
      cafes.push(newCafe);
      await fileService.writeFile('src/data/cafe_products.json', cafes);
      return newCafe;
    } else {
      const books = await fileService.readFile('src/data/products.json');
      const newBook = {
        id: generateUUID(),
        title: productData.title,
        author: productData.author,
        isbn: productData.isbn,
        price: productData.price,
        stock: productData.stock,
        type: 'book',
        category: productData.category
      };
      books.push(newBook);
      await fileService.writeFile('src/data/products.json', books);
      return newBook;
    }
  }

  async function updateProduct(id, productData) {
    // Primero intentamos actualizar en libros
    const books = await fileService.readFile('src/data/products.json');
    const bookIndex = books.findIndex(p => p.id === id);
    
    if (bookIndex !== -1) {
      books[bookIndex] = {
        id,
        title: productData.title,
        author: productData.author,
        isbn: productData.isbn,
        price: productData.price,
        stock: productData.stock,
        type: 'book',
        category: productData.category
      };
      await fileService.writeFile('src/data/products.json', books);
      return books[bookIndex];
    }

    // Si no está en libros, intentamos en cafés
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    const cafeIndex = cafes.findIndex(p => p.id === id);
    
    if (cafeIndex !== -1) {
      cafes[cafeIndex] = {
        id,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || 'Bebida'
      };
      await fileService.writeFile('src/data/cafe_products.json', cafes);
      return cafes[cafeIndex];
    }

    throw new Error('Producto no encontrado');
  }

  async function deleteProduct(id) {
    // Intentamos eliminar de libros
    const books = await fileService.readFile('src/data/products.json');
    const bookIndex = books.findIndex(p => p.id === id);
    
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      await fileService.writeFile('src/data/products.json', books);
      return;
    }

    // Si no está en libros, intentamos en cafés
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    const cafeIndex = cafes.findIndex(p => p.id === id);
    
    if (cafeIndex !== -1) {
      cafes.splice(cafeIndex, 1);
      await fileService.writeFile('src/data/cafe_products.json', cafes);
      return;
    }

    throw new Error('Producto no encontrado');
  }

  module.exports = { getProducts, createProduct, updateProduct, deleteProduct };