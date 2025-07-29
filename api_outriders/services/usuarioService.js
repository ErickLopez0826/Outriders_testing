const UsuarioRepository = require('../repositories/usuarioRepository');
const jwt = require('jsonwebtoken');
const SECRET = 'secreto'; // Cambiar en producción

class UsuarioService {
  static login(email, password) {
    try {
      const usuarios = UsuarioRepository.getAll();
      const user = usuarios.find(u => u.email === email && u.password === password);
      if (!user) return null;
      
      // Determinar rol
      const rol = user.rol || 'cliente';
      const token = jwt.sign({ 
        id: user.id, 
        email: user.email, 
        rol,
        clienteId: user.id_cliente 
      }, SECRET, { expiresIn: '1h' });
      return token;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (e) {
      return null;
    }
  }

  static findByUsername(username) {
    try {
      const usuarios = UsuarioRepository.getAll();
      return usuarios.find(u => u.email === username);
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  }

  static createUsuario({ username, password, clienteId }) {
    try {
      const usuarios = UsuarioRepository.getAll();
      const id = (usuarios.length ? Math.max(...usuarios.map(u => parseInt(u.id))) + 1 : 1).toString();
      const nuevo = { 
        id, 
        nombre: username,
        email: username, 
        password, 
        rol: 'cliente',
        id_cliente: clienteId 
      };
      usuarios.push(nuevo);
      UsuarioRepository.saveAll(usuarios);
      return nuevo;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }
}

module.exports = UsuarioService; 