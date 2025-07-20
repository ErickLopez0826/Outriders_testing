const PedidoRepository = require('../repositories/pedidoRepository');

class PedidoService {
  static getPedidoById(id) {
    const pedidos = PedidoRepository.getAll();
    return pedidos.find(p => p.id === id);
  }
  static getPedidosByCliente(clienteId) {
    const pedidos = PedidoRepository.getAll();
    return pedidos.filter(p => p.clienteId === clienteId);
  }
  static getPedidosPendientes() {
    const pedidos = PedidoRepository.getAll();
    return pedidos.filter(p => p.estado === 'Recibido');
  }
  static getPedidosEnRuta() {
    const pedidos = PedidoRepository.getAll();
    return pedidos.filter(p => p.estado === 'En ruta');
  }
  static getPedidosEntregados() {
    const pedidos = PedidoRepository.getAll();
    return pedidos.filter(p => p.estado === 'Entregado');
  }
  static createPedido({ clienteId, productos }) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    const ProductoRepository = require('../repositories/productoRepository');
    const ClienteRepository = require('../repositories/clienteRepository');
    // Validar cliente
    const cliente = ClienteRepository.getAll().find(c => c.id === clienteId);
    if (!cliente) throw new Error('Cliente no encontrado');
    // Validar productos y stock
    const productosData = ProductoRepository.getAll();
    for (const item of productos) {
      const prod = productosData.find(p => p.id === item.productoId);
      if (!prod) throw new Error(`Producto ${item.productoId} no existe`);
      if (prod.stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${prod.nombre}`);
    }
    // Descontar stock
    for (const item of productos) {
      const prod = productosData.find(p => p.id === item.productoId);
      prod.stock -= item.cantidad;
    }
    ProductoRepository.saveAll(productosData);
    // Crear pedido
    const pedidos = PedidoRepository.getAll();
    const id = (pedidos.length ? Math.max(...pedidos.map(p => parseInt(p.id))) + 1 : 1).toString();
    const fecha = new Date().toISOString();
    const nuevo = { id, clienteId, productos, estado: 'Recibido', fecha };
    pedidos.push(nuevo);
    PedidoRepository.saveAll(pedidos);
    return nuevo;
  }
  static cancelarPedido(id) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    const ProductoRepository = require('../repositories/productoRepository');
    let pedidos = PedidoRepository.getAll();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estado === 'Entregado') throw new Error('No se puede cancelar un pedido entregado');
    // Devolver stock
    const productos = ProductoRepository.getAll();
    for (const item of pedido.productos) {
      const prod = productos.find(p => p.id === item.productoId);
      if (prod) prod.stock += item.cantidad;
    }
    ProductoRepository.saveAll(productos);
    // Eliminar pedido
    pedidos = pedidos.filter(p => p.id !== id);
    PedidoRepository.saveAll(pedidos);
    return pedido;
  }
  static editarPedido(id, productos) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    const ProductoRepository = require('../repositories/productoRepository');
    let pedidos = PedidoRepository.getAll();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estado === 'Entregado') throw new Error('No se puede editar un pedido entregado');
    // Devolver stock anterior
    const productosData = ProductoRepository.getAll();
    for (const item of pedido.productos) {
      const prod = productosData.find(p => p.id === item.productoId);
      if (prod) prod.stock += item.cantidad;
    }
    // Validar y descontar stock nuevo
    for (const item of productos) {
      const prod = productosData.find(p => p.id === item.productoId);
      if (!prod) throw new Error(`Producto ${item.productoId} no existe`);
      if (prod.stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${prod.nombre}`);
    }
    for (const item of productos) {
      const prod = productosData.find(p => p.id === item.productoId);
      prod.stock -= item.cantidad;
    }
    ProductoRepository.saveAll(productosData);
    // Actualizar pedido
    pedido.productos = productos;
    PedidoRepository.saveAll(pedidos);
    return pedido;
  }
  static cambiarEstado(id, nuevoEstado) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    let pedidos = PedidoRepository.getAll();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido no encontrado');
    const estadosValidos = ['Recibido', 'En ruta', 'Entregado'];
    if (!estadosValidos.includes(nuevoEstado)) throw new Error('Estado no válido');
    // Validar flujo de estados
    const transiciones = {
      'Recibido': ['En ruta'],
      'En ruta': ['Entregado'],
      'Entregado': []
    };
    if (!transiciones[pedido.estado].includes(nuevoEstado)) {
      throw new Error(`No se puede cambiar de ${pedido.estado} a ${nuevoEstado}`);
    }
    pedido.estado = nuevoEstado;
    PedidoRepository.saveAll(pedidos);
    return pedido;
  }
  static validarPedido(id) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    let pedidos = PedidoRepository.getAll();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estado !== 'Recibido') throw new Error('Solo se pueden validar pedidos en estado Recibido');
    pedido.estado = 'En ruta';
    PedidoRepository.saveAll(pedidos);
    return pedido;
  }
  static asignarRepartidor(id, repartidor, unidad) {
    const PedidoRepository = require('../repositories/pedidoRepository');
    let pedidos = PedidoRepository.getAll();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido no encontrado');
    if (pedido.estado !== 'En ruta') throw new Error('Solo se puede asignar repartidor a pedidos en ruta');
    pedido.repartidor = repartidor;
    pedido.unidad = unidad;
    PedidoRepository.saveAll(pedidos);
    return pedido;
  }
}

module.exports = PedidoService; 