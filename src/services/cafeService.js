// src/services/cafeService.js
const CafeProduct = require('../models/CafeProduct');
const { generateUUID } = require('../utils/uuid');

async function getCafes() {
  return await CafeProduct.find();
}

async function createCafe(cafeData) {
  const newCafe = new CafeProduct({
    id: generateUUID(),
    name: cafeData.name,
    price: cafeData.price,
    stock: cafeData.stock,
    category: cafeData.category,
    description: cafeData.description || '',
    isAvailable: cafeData.isAvailable !== undefined ? cafeData.isAvailable : true
  });
  return await newCafe.save();
}

async function updateCafe(id, cafeData) {
  const updatedCafe = await CafeProduct.findOneAndUpdate(
    { id },
    {
      name: cafeData.name,
      price: cafeData.price,
      stock: cafeData.stock,
      category: cafeData.category,
      description: cafeData.description || '',
      isAvailable: cafeData.isAvailable !== undefined ? cafeData.isAvailable : true
    },
    { new: true }
  );
  if (!updatedCafe) throw new Error('Café no encontrado');
  return updatedCafe;
}

async function deleteCafe(id) {
  const deleted = await CafeProduct.findOneAndDelete({ id });
  if (!deleted) throw new Error('Café no encontrado');
  return deleted;
}

module.exports = { getCafes, createCafe, updateCafe, deleteCafe };