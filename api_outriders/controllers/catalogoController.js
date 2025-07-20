const express = require('express');
const router = express.Router();
const ProductoService = require('../services/productoService');

// GET /api/catalogo
router.get('/catalogo', (req, res) => {
  const productos = ProductoService.getCatalogo();
  res.json(productos);
});

// GET /api/productos/:id
router.get('/productos/:id', (req, res) => {
  const ProductoService = require('../services/productoService');
  const producto = ProductoService.getProductoById(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
});

module.exports = router; 