// src/services/productService.js
const Product = require('../models/Product');
const CafeProduct = require('../models/CafeProduct');
const { generateUUID } = require('../utils/uuid');

async function getProducts() {
  try {
    const books = await Product.find({ type: 'book' });
    const cafes = await CafeProduct.find();
    return [...books, ...cafes];
  } catch (error) {
    throw new Error('Error al obtener productos: ' + error.message);
  }
}

async function createProduct(productData) {
  try {
    if (productData.type === 'cafe') {
      const newCafe = new CafeProduct({
        id: productData.id || generateUUID(),
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || 'Bebida',
        description: productData.description || '',
        isAvailable: true
      });
      return await newCafe.save();
    } else {
      console.log('Creando libro con datos:', productData);
      const newBook = new Product({
        title: productData.title,
        author: productData.author,
        isbn: productData.isbn,
        price: productData.price,
        stock: productData.stock,
        type: 'book',
        category: productData.category,
        consignment: productData.consignment || false
      });
      const savedBook = await newBook.save();
      console.log('Libro guardado exitosamente:', savedBook);
      return savedBook;
    }
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw new Error('Error al crear producto: ' + error.message);
  }
}

async function updateProduct(id, productData) {
  try {
    // Primero intentamos actualizar en libros
    let product = await Product.findOne({ isbn: id });
    
    if (product) {
      product.title = productData.title;
      product.author = productData.author;
      product.isbn = productData.isbn;
      product.price = productData.price;
      product.stock = productData.stock;
      product.category = productData.category;
      return await product.save();
    }

    // Si no está en libros, intentamos en cafés
    product = await CafeProduct.findOne({ id: id });
    
    if (product) {
      product.name = productData.name;
      product.price = productData.price;
      product.stock = productData.stock;
      product.category = productData.category;
      return await product.save();
    }

    throw new Error('Producto no encontrado');
  } catch (error) {
    throw new Error('Error al actualizar producto: ' + error.message);
  }
}

async function deleteProduct(id) {
  try {
    // Intentamos eliminar de libros
    let product = await Product.findOneAndDelete({ isbn: id });
    
    if (product) {
      return;
    }

    // Si no está en libros, intentamos en cafés
    product = await CafeProduct.findOneAndDelete({ id: id });
    
    if (product) {
      return;
    }

    throw new Error('Producto no encontrado');
  } catch (error) {
    throw new Error('Error al eliminar producto: ' + error.message);
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };