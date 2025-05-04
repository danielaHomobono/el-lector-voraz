const fs = require('fs').promises;
const path = require('path');

class FileService {
  static async readFile(fileName) {
    try {
      const filePath = path.join(__dirname, '../data', fileName);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer ${fileName}:`, error);
      return []; // Retorna vacío si hay error
    }
  }

  static async writeFile(fileName, data) {
    try {
      const filePath = path.join(__dirname, '../data', fileName);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error al escribir ${fileName}:`, error);
      throw new Error('Error al guardar los datos');
    }
  }
}

module.exports = FileService;