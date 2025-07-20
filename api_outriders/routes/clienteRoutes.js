const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Controladores
const usuarioController = require('../controllers/usuarioController');
const catalogoController = require('../controllers/catalogoController');
const pedidoController = require('../controllers/pedidoController');

// Registro y login
router.post('/register', usuarioController);
router.post('/login', usuarioController);

// Catálogo
router.get('/catalogo', catalogoController);
router.get('/productos/:id', catalogoController);

// Pedidos (solo clientes autenticados y con rol)
router.post('/pedidos', auth, authRole('cliente'), pedidoController);
router.get('/pedidos/:id', auth, authRole('cliente'), pedidoController);
router.get('/pedidos/cliente/:id', auth, authRole('cliente'), pedidoController);

module.exports = router; 