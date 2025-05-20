// src/services/cafeService.js
  const fileService = require('./fileService');
  const { generateUUID } = require('../utils/uuid');

  async function getCafes() {
    return await fileService.readFile('src/data/cafe_products.json');
  }

  async function createCafe(cafeData) {
    const cafes = await getCafes();
    const newCafe = {
      id: generateUUID(),
      name: cafeData.name,
      price: cafeData.price,
      stock: cafeData.stock,
      category: cafeData.category
    };
    cafes.push(newCafe);
    await fileService.writeFile('src/data/cafe_products.json', cafes);
    return newCafe;
  }

  async function updateCafe(id, cafeData) {
    const cafes = await getCafes();
    const index = cafes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Café no encontrado');
    }
    cafes[index] = {
      id,
      name: cafeData.name,
      price: cafeData.price,
      stock: cafeData.stock,
      category: cafeData.category
    };
    await fileService.writeFile('src/data/cafe_products.json', cafes);
    return cafes[index];
  }

  async function deleteCafe(id) {
    const cafes = await getCafes();
    const index = cafes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Café no encontrado');
    }
    cafes.splice(index, 1);
    await fileService.writeFile('src/data/cafe_products.json', cafes);
  }

  module.exports = { getCafes, createCafe, updateCafe, deleteCafe };