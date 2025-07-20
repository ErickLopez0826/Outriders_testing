const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/clientes.json');

class ClienteRepository {
  static getAll() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  static saveAll(clientes) {
    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
  }
}

module.exports = ClienteRepository; 