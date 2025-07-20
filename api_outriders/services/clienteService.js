const ClienteRepository = require('../repositories/clienteRepository');

class ClienteService {
  static getClienteById(id) {
    const clientes = ClienteRepository.getAll();
    return clientes.find(c => c.id === id);
  }
  static findByEmail(email) {
    const clientes = ClienteRepository.getAll();
    return clientes.find(c => c.email === email);
  }
  static createCliente({ nombre, email, telefono }) {
    const clientes = ClienteRepository.getAll();
    const id = (clientes.length ? Math.max(...clientes.map(c => parseInt(c.id))) + 1 : 1).toString();
    const nuevo = { id, nombre, email, telefono };
    clientes.push(nuevo);
    ClienteRepository.saveAll(clientes);
    return nuevo;
  }
  static deleteCliente(id) {
    let clientes = ClienteRepository.getAll();
    clientes = clientes.filter(c => c.id !== id);
    ClienteRepository.saveAll(clientes);
  }
  static getAllClientes() {
    return ClienteRepository.getAll();
  }
}

module.exports = ClienteService; 