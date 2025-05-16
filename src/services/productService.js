const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileService = require('./fileService');
const Product = require('../models/Product');

const PRODUCTS_FILE = path.resolve(__dirname, '..', 'data', 'products.json');

async function getAllProducts() {
  return await fileService.readFile(PRODUCTS_FILE);
}

async function createProduct(data) {
  const products = await fileService.readFile(PRODUCTS_FILE);
  const product = new Product({ ...data, id: uuidv4() });
  products.push(product);
  await fileService.writeFile(PRODUCTS_FILE, products);
  return product;
}

async function updateProduct(id, data) {
  const products = await fileService.readFile(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Producto no encontrado');
  }
  const updatedProduct = new Product({ ...products[index], ...data, id });
  products[index] = updatedProduct;
  await fileService.writeFile(PRODUCTS_FILE, products);
  return updatedProduct;
}

module.exports = { getAllProducts, createProduct, updateProduct };