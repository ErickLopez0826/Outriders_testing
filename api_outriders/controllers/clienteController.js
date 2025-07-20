const express = require('express');
const router = express.Router();
const ClienteService = require('../services/clienteService');
const PedidoService = require('../services/pedidoService');
const auth = require('../middleware/auth');

// POST /api/clientes
router.post('/clientes', (req, res) => {
  // Implementación pendiente
  res.status(501).json({ mensaje: 'No implementado' });
});

// DELETE /api/clientes/:id
router.delete('/clientes/:id', auth, (req, res) => {
  const ClienteService = require('../services/clienteService');
  const cliente = ClienteService.getClienteById(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  ClienteService.deleteCliente(req.params.id);
  res.json({ mensaje: 'Cliente eliminado' });
});

// GET /api/clientes/:id/pedidos
router.get('/clientes/:id/pedidos', auth, (req, res) => {
  const pedidos = PedidoService.getPedidosByCliente(req.params.id);
  res.json(pedidos);
});

// GET /api/clientes/:id
router.get('/clientes/:id', auth, (req, res) => {
  const ClienteService = require('../services/clienteService');
  const cliente = ClienteService.getClienteById(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  res.json(cliente);
});

module.exports = router; 