const fs = require('fs').promises;
const path = require('path');

async function readFile(filePath) {
  console.log('Intentando leer archivo:', filePath);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    console.log('Archivo leído correctamente:', filePath);
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Archivo no encontrado, creando ${filePath} con []`);
      await fs.writeFile(filePath, '[]');
      return [];
    }
    console.error(`Error al leer ${filePath}:`, error);
    throw error;
  }
}

async function writeFile(filePath, data) {
  console.log('Escribiendo archivo:', filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log('Archivo escrito correctamente:', filePath);
}

module.exports = { readFile, writeFile };