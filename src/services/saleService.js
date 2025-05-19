const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fileService = require('./fileService');
const ProductService = require('./productService');
const CafeService = require('./cafeService');
const ClientService = require('./clientService');
const Sale = require('../models/Sale');

const SALES_FILE = path.resolve(__dirname, '..', 'data', 'sales.json');
const CLIENTS_FILE = path.resolve(__dirname, '..', 'data', 'clients.json');

async function createSale(data) {
  const sales = await fileService.readFile(SALES_FILE);
  const products = await ProductService.getAllProducts();
  const cafeProducts = await CafeService.getAllProducts();
  const clients = await ClientService.getAllClients();
  const client = data.clientId ? clients.find(c => c.id === data.clientId) : null;

  let total = 0;

  for (const item of data.items) {
    let product;
    if (item.type === 'cafe') {
      product = cafeProducts.find(p => p.id === item.productId);
    } else {
      product = products.find(p => p.id === item.productId);
    }
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
    if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.title || product.name}`);
    product.stock -= item.quantity;
    total += product.price * item.quantity;
  }

  // Redimir puntos si corresponde
  if (data.redeemPoints && client) {
    if (data.redeemPoints % 10 !== 0) throw new Error('Los puntos deben ser múltiplos de 10');
    if (client.points < data.redeemPoints) throw new Error('Puntos insuficientes');
    client.points -= data.redeemPoints;
    total -= (data.redeemPoints / 10) * 1000;
  }

  // Acreditar puntos si no redimió
  if (client && !data.redeemPoints) {
    const points = Math.floor(total / 1000);
    client.points += points;
  }

  const sale = new Sale({
    id: uuidv4(),
    clientId: data.clientId,
    items: data.items,
    total,
    date: new Date(),
    channel: data.channel || 'physical'
  });

  sales.push(sale);

  // Guardar todos los cambios
  await fileService.writeFile(SALES_FILE, sales);
  await fileService.writeFile(path.resolve(__dirname, '..', 'data', 'products.json'), products);
  await fileService.writeFile(path.resolve(__dirname, '..', 'data', 'cafe_products.json'), cafeProducts);
  await fileService.writeFile(CLIENTS_FILE, clients);

  return sale;
}

async function getAllSales() {
  return await fileService.readFile(SALES_FILE);
}

module.exports = { createSale, getAllSales };
