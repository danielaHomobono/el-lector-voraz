// src/services/saleService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getSales() {
    return await fileService.readFile('src/data/sales.json');
  }

  async function createSale(saleData) {
    const sales = await getSales();
    const products = await fileService.readFile('src/data/products.json');
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    const productExists = products.some(p => p.id === saleData.productId) || cafes.some(c => c.id === saleData.productId);
    if (!productExists) {
      throw new Error('Producto no encontrado');
    }
    const newSale = {
      id: generateUUID(),
      productId: saleData.productId,
      quantity: saleData.quantity,
      totalPrice: saleData.totalPrice,
      date: new Date().toISOString(),
      clientId: saleData.clientId || null
    };
    sales.push(newSale);
    await fileService.writeFile('src/data/sales.json', sales);
    return newSale;
  }

  async function updateSale(id, saleData) {
    const sales = await getSales();
    const products = await fileService.readFile('src/data/products.json');
    const cafes = await fileService.readFile('src/data/cafe_products.json');
    const productExists = products.some(p => p.id === saleData.productId) || cafes.some(c => c.id === saleData.productId);
    if (!productExists) {
      throw new Error('Producto no encontrado');
    }
    const index = sales.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Venta no encontrada');
    }
    sales[index] = {
      id,
      productId: saleData.productId,
      quantity: saleData.quantity,
      totalPrice: saleData.totalPrice,
      date: sales[index].date,
      clientId: saleData.clientId || null
    };
    await fileService.writeFile('src/data/sales.json', sales);
    return sales[index];
  }

  async function deleteSale(id) {
    const sales = await getSales();
    const index = sales.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Venta no encontrada');
    }
    sales.splice(index, 1);
    await fileService.writeFile('src/data/sales.json', sales);
  }

  module.exports = { getSales, createSale, updateSale, deleteSale };