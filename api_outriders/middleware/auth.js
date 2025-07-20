const UsuarioService = require('../services/usuarioService');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token requerido' });
  const user = UsuarioService.verifyToken(token);
  if (!user) return res.status(403).json({ mensaje: 'Token inválido' });
  req.user = user;
  next();
}

module.exports = authMiddleware; 