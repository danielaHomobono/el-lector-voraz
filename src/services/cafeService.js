const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileService = require('./fileService');
const CafeProduct = require('../models/CafeProduct');

const CAFE_FILE = path.resolve(__dirname, '..', 'data', 'cafe_products.json');

async function getAllCafes() {
  return await fileService.readFile(CAFE_FILE);
}

async function createProduct(data) {
  const products = await fileService.readFile(CAFE_FILE);
  const product = new CafeProduct({ ...data, id: uuidv4() });
  products.push(product);
  await fileService.writeFile(CAFE_FILE, products);
  return product;
}

async function updateProduct(id, data) {
  const products = await fileService.readFile(CAFE_FILE);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Producto no encontrado');
  }
  const updatedProduct = new CafeProduct({ ...products[index], ...data, id });
  products[index] = updatedProduct;
  await fileService.writeFile(CAFE_FILE, products);
  return updatedProduct;
}

module.exports = { getAllCafes, createProduct, updateProduct };