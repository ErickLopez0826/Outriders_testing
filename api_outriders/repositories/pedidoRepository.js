const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/pedidos.json');

class PedidoRepository {
  static getAll() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  static saveAll(pedidos) {
    fs.writeFileSync(dataPath, JSON.stringify(pedidos, null, 2));
  }
}

module.exports = PedidoRepository; 