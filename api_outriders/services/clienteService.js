const ClienteRepository = require('../repositories/clienteRepository');

class ClienteService {
  static getClienteById(id) {
    try {
      const clientes = ClienteRepository.getAll();
      const clienteId = parseInt(id);
      return clientes.find(c => c.id === clienteId);
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      throw error;
    }
  }

  static findByEmail(email) {
    try {
      const clientes = ClienteRepository.getAll();
      return clientes.find(c => c.email === email);
    } catch (error) {
      console.error('Error al buscar cliente por email:', error);
      throw error;
    }
  }

  static createCliente({ nombre, email, telefono }) {
    try {
      const clientes = ClienteRepository.getAll();
      const id = (clientes.length ? Math.max(...clientes.map(c => parseInt(c.id))) + 1 : 1).toString();
      const nuevo = { 
        id, 
        nombre_empresa: nombre,
        rfc: `RFC${id.padStart(3, '0')}`,
        direccion: 'Dirección pendiente',
        contacto: nombre,
        telefono, 
        email 
      };
      clientes.push(nuevo);
      ClienteRepository.saveAll(clientes);
      return nuevo;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  }

  static deleteCliente(id) {
    try {
      let clientes = ClienteRepository.getAll();
      const clienteId = parseInt(id);
      clientes = clientes.filter(c => c.id !== clienteId);
      ClienteRepository.saveAll(clientes);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }

  static getAllClientes() {
    try {
      return ClienteRepository.getAll();
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error);
      throw error;
    }
  }
}

module.exports = ClienteService; 