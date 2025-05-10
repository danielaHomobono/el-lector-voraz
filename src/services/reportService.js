const fileService = require('./fileService');

const SALES_FILE = './src/data/sales.json';
const PRODUCTS_FILE = './src/data/products.json';
const CAFE_FILE = './src/data/cafe_products.json';

async function getSalesReport() {
  const sales = await fileService.readFile(SALES_FILE);
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const salesByChannel = sales.reduce((acc, sale) => {
    acc[sale.channel] = (acc[sale.channel] || 0) + sale.total;
    return acc;
  }, {});
  return {
    totalSales,
    salesCount: sales.length,
    salesByChannel
  };
}

async function getInventoryReport() {
  const products = await fileService.readFile(PRODUCTS_FILE);
  const cafeProducts = await fileService.readFile(CAFE_FILE);
  const lowStock = [...products, ...cafeProducts].filter(p => p.stock < 5);
  return {
    totalProducts: products.length + cafeProducts.length,
    lowStock
  };
}

async function getFinancialReport() {
  const sales = await fileService.readFile(SALES_FILE);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const libraryRevenue = sales
    .filter(sale => sale.items.some(item => ['book', 'magazine'].includes(item.type)))
    .reduce((sum, sale) => sum + sale.total, 0);
  const cafeRevenue = sales
    .filter(sale => sale.items.some(item => item.type === 'cafe'))
    .reduce((sum, sale) => sum + sale.total, 0);
  return {
    totalRevenue,
    libraryRevenue,
    cafeRevenue,
    libraryPercentage: (libraryRevenue / totalRevenue) * 100 || 0,
    cafePercentage: (cafeRevenue / totalRevenue) * 100 || 0
  };
}

module.exports = { getSalesReport, getInventoryReport, getFinancialReport };