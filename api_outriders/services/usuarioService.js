const UsuarioRepository = require('../repositories/usuarioRepository');
const jwt = require('jsonwebtoken');
const SECRET = 'secreto'; // Cambiar en producción

class UsuarioService {
  static login(username, password) {
    const usuarios = UsuarioRepository.getAll();
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (!user) return null;
    // Determinar rol (por ejemplo, si username es 'admin' o tiene un campo rol)
    const rol = user.rol || (user.username === 'admin' ? 'admin' : 'cliente');
    const token = jwt.sign({ id: user.id, username: user.username, rol }, SECRET, { expiresIn: '1h' });
    return token;
  }
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (e) {
      return null;
    }
  }
  static findByUsername(username) {
    const usuarios = UsuarioRepository.getAll();
    return usuarios.find(u => u.username === username);
  }
  static createUsuario({ username, password, clienteId }) {
    const usuarios = UsuarioRepository.getAll();
    const id = (usuarios.length ? Math.max(...usuarios.map(u => parseInt(u.id))) + 1 : 1).toString();
    const nuevo = { id, username, password, clienteId };
    usuarios.push(nuevo);
    UsuarioRepository.saveAll(usuarios);
    return nuevo;
  }
}

module.exports = UsuarioService; 