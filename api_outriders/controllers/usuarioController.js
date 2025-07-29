const UsuarioService = require('../services/usuarioService');
const ClienteService = require('../services/clienteService');

// POST /api/login
const login = (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y password son requeridos' });
    }
    
    const token = UsuarioService.login(email, password);
    if (!token) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/register
const register = (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;
    
    if (!nombre || !email || !telefono || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    // Validar que el usuario y el email no existan
    if (UsuarioService.findByUsername(email)) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' });
    }
    
    if (ClienteService.findByEmail(email)) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' });
    }
    
    // Crear cliente y usuario
    const cliente = ClienteService.createCliente({ nombre, email, telefono });
    const usuario = UsuarioService.createUsuario({ username: email, password, clienteId: cliente.id });
    
    res.status(201).json({ 
      mensaje: 'Registro exitoso', 
      cliente,
      usuario: { id: usuario.id, email: usuario.email }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  login,
  register
}; 