const fileService = require('../src/services/fileService');
const path = require('path');
const fs = require('fs');

const pageController = {
    // Renderiza la página principal
    getHome: (req, res) => {
        console.log('Renderizando index.pug');
        res.render('index', { title: 'El Lector Voraz', user: req.session.user });
    },

    // Renderiza la página de inventario
    getInventory: async (req, res) => {
        try {
            console.log('Renderizando inventory.pug');
            const products = await fileService.readFile('src/data/products.json');
            const cafes = await fileService.readFile('src/data/cafe_products.json');
            res.render('inventory', { title: 'Inventario', products, cafes, user: req.session.user });
        } catch (error) {
            console.error('Error en /inventory:', error);
            res.status(500).send(`Error al cargar inventario: ${error.message}`);
        }
    },

    // Renderiza la página de productos
    getProducts: async (req, res) => {
        try {
            console.log('Renderizando products.pug');
            if (!fs.existsSync(path.join(__dirname, '../views/products.pug'))) {
                throw new Error('products.pug no encontrado en views/');
            }
            const products = await fileService.readFile('src/data/products.json');
            res.render('products', { title: 'Catálogo de Libros', products, user: req.session.user });
        } catch (error) {
            console.error('Error en /products:', error);
            res.status(500).send(`Error al cargar productos: ${error.message}`);
        }
    },

    // Renderiza la página de cafés
    getCafes: async (req, res) => {
        try {
            console.log('Renderizando cafes.pug');
            const cafes = await fileService.readFile('src/data/cafe_products.json');
            res.render('cafes', { title: 'Cafetería', cafes, user: req.session.user });
        } catch (error) {
            console.error('Error en /cafes:', error);
            res.status(500).send(`Error al cargar cafés: ${error.message}`);
        }
    }
};

module.exports = pageController; 