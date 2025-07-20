const express = require('express');
const router = express.Router();
const PedidoService = require('../services/pedidoService');
const auth = require('../middleware/auth');

// GET /api/pedidos/:id
// Ya implementado: busca el pedido por ID, responde 404 si no existe, protegido con JWT.
router.get('/pedidos/:id', auth, (req, res) => {
  const pedido = PedidoService.getPedidoById(req.params.id);
  if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
  res.json(pedido);
});

// PUT /api/pedidos/estado/:id
router.put('/pedidos/estado/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ mensaje: 'Estado requerido' });
  try {
    const pedido = PedidoService.cambiarEstado(req.params.id, estado);
    res.json({ mensaje: 'Estado actualizado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// PUT /api/pedidos/:id
router.put('/pedidos/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const { productos } = req.body;
  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Productos requeridos' });
  }
  try {
    const pedido = PedidoService.editarPedido(req.params.id, productos);
    res.json({ mensaje: 'Pedido actualizado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// DELETE /api/pedidos/:id
router.delete('/pedidos/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  try {
    const pedido = PedidoService.cancelarPedido(req.params.id);
    res.json({ mensaje: 'Pedido cancelado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// POST /api/pedidos
router.post('/pedidos', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const { clienteId, productos } = req.body;
  if (!clienteId || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Datos de pedido incompletos' });
  }
  try {
    const pedido = PedidoService.createPedido({ clienteId, productos });
    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// GET /api/pedidos/cliente/:id
router.get('/pedidos/cliente/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedidos = PedidoService.getPedidosByCliente(req.params.id);
  res.json(pedidos);
});

module.exports = router; 