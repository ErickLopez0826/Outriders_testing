const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/usuarios.json');

class UsuarioRepository {
  static getAll() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  static saveAll(usuarios) {
    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));
  }
}

module.exports = UsuarioRepository; 