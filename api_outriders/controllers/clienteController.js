const ClienteService = require('../services/clienteService');
const PedidoService = require('../services/pedidoService');

// POST /api/clientes
const createCliente = (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email || !telefono) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const cliente = ClienteService.createCliente({ nombre, email, telefono });
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/clientes/:id
const deleteCliente = (req, res) => {
  try {
    const cliente = ClienteService.getClienteById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    ClienteService.deleteCliente(req.params.id);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/clientes/:id/pedidos
const getPedidosCliente = (req, res) => {
  try {
    const pedidos = PedidoService.getPedidosByCliente(req.params.id);
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/clientes/:id
const getClienteById = (req, res) => {
  try {
    const cliente = ClienteService.getClienteById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  createCliente,
  deleteCliente,
  getPedidosCliente,
  getClienteById
}; 