const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Controladores
const pedidoController = require('../controllers/pedidoController');
const clienteController = require('../controllers/clienteController');

// Pedidos (admin)
router.put('/pedidos/:id', auth, authRole('admin'), pedidoController);
router.delete('/pedidos/:id', auth, authRole('admin'), pedidoController);
router.put('/pedidos/estado/:id', auth, authRole('admin'), pedidoController);

// Clientes (admin)
router.post('/clientes', auth, authRole('admin'), clienteController);
router.get('/clientes/:id', auth, authRole('admin'), clienteController);
router.delete('/clientes/:id', auth, authRole('admin'), clienteController);

module.exports = router; 