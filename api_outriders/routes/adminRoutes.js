const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Controladores
const { 
  editarPedido, 
  cancelarPedido, 
  cambiarEstado 
} = require('../controllers/pedidoController');
const { 
  createCliente, 
  deleteCliente, 
  getClienteById 
} = require('../controllers/clienteController');

// Pedidos (admin)
router.put('/pedidos/:id', auth, authRole('admin'), editarPedido);
router.delete('/pedidos/:id', auth, authRole('admin'), cancelarPedido);
router.put('/pedidos/estado/:id', auth, authRole('admin'), cambiarEstado);

// Clientes (admin)
router.post('/clientes', auth, authRole('admin'), createCliente);
router.get('/clientes/:id', auth, authRole('admin'), getClienteById);
router.delete('/clientes/:id', auth, authRole('admin'), deleteCliente);

module.exports = router; 