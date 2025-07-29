const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Controladores
const { login, register } = require('../controllers/usuarioController');
const { getCatalogo, getProductoById } = require('../controllers/catalogoController');
const { 
  getPedidoById, 
  createPedido, 
  getPedidosByCliente 
} = require('../controllers/pedidoController');

// Registro y login
router.post('/register', register);
router.post('/login', login);

// Ruta de prueba para verificar rol del usuario
router.get('/me', auth, (req, res) => {
  res.json({ 
    mensaje: 'Información del usuario actual',
    usuario: req.user 
  });
});

// Catálogo
router.get('/catalogo', getCatalogo);
router.get('/productos/:id', getProductoById);

// Pedidos (solo clientes autenticados y con rol)
router.post('/pedidos', auth, authRole('cliente'), createPedido);
router.get('/pedidos/:id', auth, authRole('cliente'), getPedidoById);
router.get('/pedidos/cliente/:id', auth, authRole('cliente'), getPedidosByCliente);

module.exports = router; 