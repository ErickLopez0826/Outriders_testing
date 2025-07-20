module.exports = function authRole(rolRequerido) {
  return function (req, res, next) {
    if (!req.user || req.user.rol !== rolRequerido) {
      return res.status(403).json({ mensaje: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
}; 