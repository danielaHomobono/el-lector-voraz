const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const connectDB = require('../config/database');

// Importar modelos
const Product = require('../models/Product');
const CafeProduct = require('../models/CafeProduct');
const Client = require('../models/Client');
const Sale = require('../models/Sale');
const Post = require('../models/Post');
const User = require('../models/User');

// Función para leer archivos JSON
async function readJsonFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Función para limpiar datos de productos
function cleanProductData(product) {
  return {
    type: product.type || 'book',
    title: product.title,
    author: product.author,
    isbn: product.isbn,
    price: product.price,
    stock: product.stock,
    category: product.category,
    consignment: product.consignment || false
  };
}

// Función para limpiar datos de productos de cafetería
function cleanCafeProductData(cafeProduct) {
  return {
    name: cafeProduct.name,
    price: cafeProduct.price,
    stock: cafeProduct.stock,
    category: cafeProduct.category || 'Bebida'
  };
}

// Función para limpiar datos de clientes
function cleanClientData(client) {
  return {
    name: client.name,
    email: client.email,
    points: client.points || 0,
    phone: client.phone || null
  };
}

// Función para limpiar datos de ventas
function cleanSaleData(sale) {
  return {
    total: sale.total,
    channel: sale.channel,
    clientId: sale.clientId || null,
    items: sale.items.map(item => ({
      productId: item.productId,
      type: item.type,
      quantity: item.quantity
    })),
    status: 'completed'
  };
}

// Función para limpiar datos de posts
function cleanPostData(post) {
  return {
    title: post.title,
    content: post.content,
    author: null, // Se actualizará después con un usuario admin
    isPublished: true
  };
}

// Función para limpiar datos de usuarios
function cleanUserData(user) {
  return {
    email: user.email,
    password: user.password, // Se hasheará después
    role: user.role,
    isActive: true
  };
}

async function migrateData() {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Leer archivos JSON
    const clientsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/clients.json'), 'utf8'));
    const productsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8'));
    const cafeProductsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/cafe_products.json'), 'utf8'));
    const salesData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/sales.json'), 'utf8'));
    const postsData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/posts.json'), 'utf8'));
    const usersData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8'));

    // Limpiar colecciones existentes
    await Promise.all([
      Client.deleteMany({}),
      Product.deleteMany({}),
      CafeProduct.deleteMany({}),
      Sale.deleteMany({}),
      Post.deleteMany({}),
      User.deleteMany({})
    ]);

    console.log('Colecciones limpiadas');

    // Migrar datos
    const clients = await Client.insertMany(clientsData);
    console.log(`${clients.length} clientes migrados`);

    const products = await Product.insertMany(productsData);
    console.log(`${products.length} productos migrados`);

    const cafeProducts = await CafeProduct.insertMany(cafeProductsData);
    console.log(`${cafeProducts.length} productos de café migrados`);

    const users = await User.insertMany(usersData);
    console.log(`${users.length} usuarios migrados`);

    // Crear mapas para búsqueda rápida
    const productMap = new Map(products.map(p => [p.isbn, p._id]));
    const cafeProductMap = new Map(cafeProducts.map(p => [p.id, p._id]));
    const clientMap = new Map(clients.map(c => [c.email, c._id]));
    const userMap = new Map(users.map(u => [u.id, u._id]));

    // PREVISUALIZAR los productId faltantes antes de insertar
    let missingProductIds = [];
    const salesMapped = salesData.map(sale => {
      const mappedItems = sale.items.map(item => {
        let mappedId = null;
        if (item.type === 'book') {
          mappedId = productMap.get(item.productId);
        } else {
          mappedId = cafeProductMap.get(item.productId);
        }
        if (!mappedId) {
          missingProductIds.push({ type: item.type, productId: item.productId });
        }
        return {
          ...item,
          productId: mappedId
        };
      });
      return {
        ...sale,
        clientId: sale.clientId ? clientMap.get(sale.clientId) : null,
        items: mappedItems
      };
    });
    if (missingProductIds.length > 0) {
      console.error('No se encontraron los siguientes productId en los productos:');
      console.error(missingProductIds);
      throw new Error('Faltan productId en los productos/café');
    }
    // Ahora sí, insertar ventas
    const sales = await Sale.insertMany(salesMapped);
    console.log(`${sales.length} ventas migradas`);

    // Migrar posts con el mapa de usuarios
    const posts = await Post.insertMany(postsData.map(post => ({
      ...post,
      author: userMap.get(post.author)
    })));
    console.log(`${posts.length} posts migrados`);

    console.log('Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

migrateData(); 