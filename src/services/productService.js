const FileService = require('./fileService');
const Product = require('../models/Product');

class ProductService {
  static async getAllProducts() {
    return await FileService.readFile('products.json');
  }

  static async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find((product) => product.id === id);
  }

  static async createProduct(data) {
    const products = await this.getAllProducts();
    const newProduct = new Product(data);
    products.push(newProduct);
    await FileService.writeFile('products.json', products);
    return newProduct;
  }

  static async updateProduct(id, data) {
    const products = await this.getAllProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    products[index] = { ...products[index], ...data };
    await FileService.writeFile('products.json', products);
    return products[index];
  }

  static async deleteProduct(id) {
    const products = await this.getAllProducts();
    const filteredProducts = products.filter((product) => product.id !== id);
    if (filteredProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }
    await FileService.writeFile('products.json', filteredProducts);
  }
}

module.exports = ProductService;