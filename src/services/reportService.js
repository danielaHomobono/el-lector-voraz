const path = require('path');
const fileService = require('./fileService');

const PRODUCTS_FILE = path.resolve(__dirname, '..', 'data', 'products.json');
const CAFE_FILE = path.resolve(__dirname, '..', 'data', 'cafe_products.json');
const SALES_FILE = path.resolve(__dirname, '..', 'data', 'sales.json');

async function getInventoryReport() {
  const books = await fileService.readFile(PRODUCTS_FILE);
  const cafeProducts = await fileService.readFile(CAFE_FILE);
  const allProducts = [
    ...books.map(p => ({ ...p, type: 'book' })),
    ...cafeProducts.map(p => ({ ...p, type: 'cafe' }))
  ];
  const lowStock = allProducts.filter(p => p.stock < 5);
  return {
    totalProducts: allProducts.length,
    lowStock
  };
}

async function getFinancialReport() {
  const sales = await fileService.readFile(SALES_FILE);
  let totalRevenue = 0;
  let libraryRevenue = 0;
  let cafeRevenue = 0;

  const books = await fileService.readFile(PRODUCTS_FILE);
  const cafeProducts = await fileService.readFile(CAFE_FILE);
  const bookMap = new Map(books.map(b => [b.id, b.price]));
  const cafeMap = new Map(cafeProducts.map(c => [c.id, c.price]));

  for (const sale of sales) {
    for (const item of sale.items) {
      const price = item.type === 'book' ? bookMap.get(item.productId) : cafeMap.get(item.productId);
      const revenue = price * item.quantity;
      totalRevenue += revenue;
      if (item.type === 'book') {
        libraryRevenue += revenue;
      } else {
        cafeRevenue += revenue;
      }
    }
  }

  const libraryPercentage = totalRevenue ? (libraryRevenue / totalRevenue) * 100 : 0;
  const cafePercentage = totalRevenue ? (cafeRevenue / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    libraryRevenue,
    cafeRevenue,
    libraryPercentage,
    cafePercentage
  };
}

module.exports = { getInventoryReport, getFinancialReport };