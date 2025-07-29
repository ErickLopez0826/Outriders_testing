const ProductoService = require('../services/productoService');

// GET /api/catalogo
const getCatalogo = (req, res) => {
  try {
    const productos = ProductoService.getCatalogo();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener catálogo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/productos/:id
const getProductoById = (req, res) => {
  try {
    const producto = ProductoService.getProductoById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  getCatalogo,
  getProductoById
}; 