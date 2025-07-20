const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/admin/pedidos/pendientes
router.get('/admin/pedidos/pendientes', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedidos = PedidoService.getPedidosPendientes();
  res.json(pedidos);
});

// GET /api/admin/pedidos/detalle/:id
router.get('/admin/pedidos/detalle/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedido = PedidoService.getPedidoById(req.params.id);
  if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
  res.json(pedido);
});

// GET /api/admin/clientes
router.get('/admin/clientes', auth, (req, res) => {
  const ClienteService = require('../services/clienteService');
  const clientes = ClienteService.getAllClientes();
  res.json(clientes);
});

// PUT /api/admin/pedidos/validar/:id
router.put('/admin/pedidos/validar/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  try {
    const pedido = PedidoService.validarPedido(req.params.id);
    res.json({ mensaje: 'Pedido validado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// PUT /api/admin/pedidos/rechazar/:id
router.put('/admin/pedidos/rechazar/:id', auth, (req, res) => {
  // Implementación pendiente
  res.status(501).json({ mensaje: 'No implementado' });
});

// PUT /api/admin/pedidos/asignarZona/:id
router.put('/admin/pedidos/asignarZona/:id', auth, (req, res) => {
  // Implementación pendiente
  res.status(501).json({ mensaje: 'No implementado' });
});

module.exports = router; 