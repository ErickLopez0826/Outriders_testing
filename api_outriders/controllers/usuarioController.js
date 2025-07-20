const express = require('express');
const router = express.Router();
const UsuarioService = require('../services/usuarioService');

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const token = UsuarioService.login(username, password);
  if (!token) return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  res.json({ token });
});

// POST /api/register
router.post('/register', (req, res) => {
  const { nombre, email, telefono, username, password } = req.body;
  if (!nombre || !email || !telefono || !username || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  const UsuarioService = require('../services/usuarioService');
  const ClienteService = require('../services/clienteService');
  // Validar que el usuario y el email no existan
  if (UsuarioService.findByUsername(username)) {
    return res.status(409).json({ mensaje: 'El usuario ya existe' });
  }
  if (ClienteService.findByEmail(email)) {
    return res.status(409).json({ mensaje: 'El email ya está registrado' });
  }
  // Crear cliente y usuario
  const cliente = ClienteService.createCliente({ nombre, email, telefono });
  UsuarioService.createUsuario({ username, password, clienteId: cliente.id });
  res.status(201).json({ mensaje: 'Registro exitoso', cliente });
});

module.exports = router; 