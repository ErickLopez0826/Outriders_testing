const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/productos.json');

class ProductoRepository {
  static getAll() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  static saveAll(productos) {
    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
  }
}

module.exports = ProductoRepository; 