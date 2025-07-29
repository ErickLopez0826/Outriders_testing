const PedidoService = require('../services/pedidoService');

// GET /api/pedidos/:id
const getPedidoById = (req, res) => {
  try {
    const pedido = PedidoService.getPedidoById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/pedidos/estado/:id
const cambiarEstado = (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ mensaje: 'Estado requerido' });
    }
    const pedido = PedidoService.cambiarEstado(req.params.id, estado);
    res.json({ mensaje: 'Estado actualizado', pedido });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

// PUT /api/pedidos/:id
const editarPedido = (req, res) => {
  try {
    const { productos } = req.body;
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Productos requeridos' });
    }
    const pedido = PedidoService.editarPedido(req.params.id, productos);
    res.json({ mensaje: 'Pedido actualizado', pedido });
  } catch (error) {
    console.error('Error al editar pedido:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

// DELETE /api/pedidos/:id
const cancelarPedido = (req, res) => {
  try {
    const pedido = PedidoService.cancelarPedido(req.params.id);
    res.json({ mensaje: 'Pedido cancelado', pedido });
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

// POST /api/pedidos
const createPedido = (req, res) => {
  try {
    const { clienteId, productos } = req.body;
    if (!clienteId || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Datos de pedido incompletos' });
    }
    const pedido = PedidoService.createPedido({ clienteId, productos });
    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

// GET /api/pedidos/cliente/:id
const getPedidosByCliente = (req, res) => {
  try {
    const pedidos = PedidoService.getPedidosByCliente(req.params.id);
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  getPedidoById,
  cambiarEstado,
  editarPedido,
  cancelarPedido,
  createPedido,
  getPedidosByCliente
}; 