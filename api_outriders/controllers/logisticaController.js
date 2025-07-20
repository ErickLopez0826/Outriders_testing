const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/logistica/pedidos/validados
router.get('/logistica/pedidos/validados', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedidos = PedidoService.getPedidosEnRuta();
  res.json(pedidos);
});

// GET /api/logistica/ruta/seguimiento/:id
router.get('/logistica/ruta/seguimiento/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedido = PedidoService.getPedidoById(req.params.id);
  if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
  // Simulación de seguimiento GPS y estatus
  const seguimiento = {
    pedidoId: pedido.id,
    estado: pedido.estado,
    ubicacion: pedido.estado === 'En ruta' ? 'En tránsito' : 'Centro de distribución',
    gps: pedido.estado === 'En ruta' ? { lat: -34.6, lng: -58.4 } : null
  };
  res.json(seguimiento);
});

// GET /api/logistica/reportes/diarios
router.get('/logistica/reportes/diarios', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const pedidos = PedidoService.getPedidosEnRuta();
  const entregados = PedidoService.getPedidosEntregados();
  const reporte = {
    fecha: new Date().toISOString().slice(0, 10),
    totalEnRuta: pedidos.length,
    totalEntregados: entregados.length,
    pedidosEnRuta: pedidos,
    pedidosEntregados: entregados
  };
  res.json(reporte);
});

// PUT /api/logistica/asignar-repartidor/:id
router.put('/logistica/asignar-repartidor/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const { repartidor, unidad } = req.body;
  if (!repartidor || !unidad) return res.status(400).json({ mensaje: 'Repartidor y unidad requeridos' });
  try {
    const pedido = PedidoService.asignarRepartidor(req.params.id, repartidor, unidad);
    res.json({ mensaje: 'Repartidor asignado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// PUT /api/logistica/ruta/estado/:id
router.put('/logistica/ruta/estado/:id', auth, (req, res) => {
  const PedidoService = require('../services/pedidoService');
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ mensaje: 'Estado requerido' });
  try {
    const pedido = PedidoService.cambiarEstado(req.params.id, estado);
    res.json({ mensaje: 'Estado actualizado', pedido });
  } catch (e) {
    res.status(400).json({ mensaje: e.message });
  }
});

// POST /api/logistica/incidencias
router.post('/logistica/incidencias', auth, (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const { pedidoId, descripcion } = req.body;
  if (!pedidoId || !descripcion) return res.status(400).json({ mensaje: 'pedidoId y descripcion requeridos' });
  const incidenciasPath = path.join(__dirname, '../data/incidencias.json');
  let incidencias = [];
  if (fs.existsSync(incidenciasPath)) {
    incidencias = JSON.parse(fs.readFileSync(incidenciasPath, 'utf8'));
  }
  const nueva = {
    id: (incidencias.length ? Math.max(...incidencias.map(i => parseInt(i.id))) + 1 : 1).toString(),
    pedidoId,
    descripcion,
    fecha: new Date().toISOString()
  };
  incidencias.push(nueva);
  fs.writeFileSync(incidenciasPath, JSON.stringify(incidencias, null, 2));
  res.status(201).json({ mensaje: 'Incidencia registrada', incidencia: nueva });
});

module.exports = router; 