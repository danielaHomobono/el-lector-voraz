// src/services/saleService.js
const Sale = require('../models/Sale');

async function getSales() {
  return await Sale.find().sort({ createdAt: -1 });
}

async function createSale(saleData) {
  // saleData: { name, email, address, products: [{productId, title, isbn, price, quantity}] }
  if (!saleData.products || !Array.isArray(saleData.products) || saleData.products.length === 0) {
    throw new Error('No se enviaron productos para la venta');
  }
  // Calcular total
  const total = saleData.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Mapear productos a items del modelo
  const items = saleData.products.map(item => ({
    productId: item.productId || item.isbn, // Ajustar según cómo se guarde el producto
    type: item.type || 'book',
    quantity: item.quantity,
    price: item.price
  }));
  // Crear venta
  const newSale = new Sale({
    total,
    channel: 'online',
    clientId: null, // Si tienes el id del cliente, ponlo aquí
    items,
    status: 'completed'
  });
  await newSale.save();
  return newSale;
}

async function updateSale(id, saleData) {
  // Permitir actualizar los campos principales de la venta
  const update = {};
  if (saleData.totalPrice) update.total = saleData.totalPrice;
  if (saleData.channel) update.channel = saleData.channel;
  if (saleData.clientId) update.clientId = saleData.clientId;
  if (saleData.status) update.status = saleData.status;
  if (saleData.products && Array.isArray(saleData.products)) {
    update.items = saleData.products.map(item => ({
      productId: item.productId || item.isbn,
      type: item.type || 'book',
      quantity: item.quantity,
      price: item.price
    }));
  }
  const updated = await Sale.findByIdAndUpdate(id, update, { new: true });
  if (!updated) throw new Error('Venta no encontrada');
  return updated;
}

async function deleteSale(id) {
  await Sale.findByIdAndDelete(id);
}

async function getSaleById(id) {
  return await Sale.findById(id);
}

module.exports = { getSales, createSale, updateSale, deleteSale, getSaleById };