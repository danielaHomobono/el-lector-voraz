// src/services/productService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getProducts() {
    return await fileService.readFile('src/data/products.json');
  }

  async function createProduct(productData) {
    const products = await getProducts();
    const newProduct = {
      id: generateUUID(),
      title: productData.title,
      author: productData.author,
      isbn: productData.isbn,
      price: productData.price,
      stock: productData.stock
    };
    products.push(newProduct);
    await fileService.writeFile('src/data/products.json', products);
    return newProduct;
  }

  async function updateProduct(id, productData) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    products[index] = {
      id,
      title: productData.title,
      author: productData.author,
      isbn: productData.isbn,
      price: productData.price,
      stock: productData.stock
    };
    await fileService.writeFile('src/data/products.json', products);
    return products[index];
  }

  async function deleteProduct(id) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    products.splice(index, 1);
    await fileService.writeFile('src/data/products.json', products);
  }

  module.exports = { getProducts, createProduct, updateProduct, deleteProduct };