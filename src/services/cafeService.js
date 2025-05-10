const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fileService = require('./fileService');
const CafeProduct = require('../models/CafeProduct');

const CAFE_FILE = path.resolve(__dirname, '..', 'data', 'cafe_products.json');

async function getAllProducts() {
  return await fileService.readFile(CAFE_FILE);
}

async function getProductById(id) {
  const products = await getAllProducts();
  return products.find(p => p.id === id);
}

async function createProduct(data) {
  const products = await getAllProducts();
  const product = new CafeProduct({ id: uuidv4(), ...data });
  products.push(product);
  await fileService.writeFile(CAFE_FILE, products);
  return product;
}

async function updateProduct(id, data) {
  const products = await getAllProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Producto no encontrado');
  products[index] = { ...products[index], ...data };
  await fileService.writeFile(CAFE_FILE, products);
  return products[index];
}

async function deleteProduct(id) {
  const products = await getAllProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) throw new Error('Producto no encontrado');
  await fileService.writeFile(CAFE_FILE, filtered);
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };