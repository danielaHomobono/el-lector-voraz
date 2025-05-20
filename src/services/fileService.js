// src/services/fileService.js
     const fs = require('fs').promises;

     async function readFile(filePath) {
       try {
         const data = await fs.readFile(filePath, 'utf8');
         return JSON.parse(data);
       } catch (error) {
         throw new Error(`Error al leer ${filePath}: ${error.message}`);
       }
     }

     async function writeFile(filePath, data) {
       try {
         await fs.writeFile(filePath, JSON.stringify(data, null, 2));
       } catch (error) {
         throw new Error(`Error al escribir ${filePath}: ${error.message}`);
       }
     }

     module.exports = { readFile, writeFile };