const PedidoRepository = require('../repositories/pedidoRepository');
const ProductoRepository = require('../repositories/productoRepository');
const ClienteRepository = require('../repositories/clienteRepository');

class PedidoService {
  static getPedidoById(id) {
    try {
      const pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      return pedidos.find(p => p.id === pedidoId);
    } catch (error) {
      console.error('Error al obtener pedido por ID:', error);
      throw error;
    }
  }

  static getPedidosByCliente(clienteId) {
    try {
      const pedidos = PedidoRepository.getAll();
      const clienteIdNum = parseInt(clienteId);
      return pedidos.filter(p => p.clienteId === clienteIdNum);
    } catch (error) {
      console.error('Error al obtener pedidos por cliente:', error);
      throw error;
    }
  }

  static getPedidosPendientes() {
    try {
      const pedidos = PedidoRepository.getAll();
      return pedidos.filter(p => p.estado === 'Recibido');
    } catch (error) {
      console.error('Error al obtener pedidos pendientes:', error);
      throw error;
    }
  }

  static getPedidosEnRuta() {
    try {
      const pedidos = PedidoRepository.getAll();
      return pedidos.filter(p => p.estado === 'En ruta');
    } catch (error) {
      console.error('Error al obtener pedidos en ruta:', error);
      throw error;
    }
  }

  static getPedidosEntregados() {
    try {
      const pedidos = PedidoRepository.getAll();
      return pedidos.filter(p => p.estado === 'Entregado');
    } catch (error) {
      console.error('Error al obtener pedidos entregados:', error);
      throw error;
    }
  }

  static createPedido({ clienteId, productos }) {
    try {
      // Validar cliente
      const cliente = ClienteRepository.getAll().find(c => c.id === parseInt(clienteId));
      if (!cliente) throw new Error('Cliente no encontrado');
      
      // Validar productos y stock
      const productosData = ProductoRepository.getAll();
      for (const item of productos) {
        const prod = productosData.find(p => p.id === parseInt(item.productoId));
        if (!prod) throw new Error(`Producto ${item.productoId} no existe`);
        if (prod.stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${prod.nombre}`);
      }
      
      // Descontar stock
      for (const item of productos) {
        const prod = productosData.find(p => p.id === parseInt(item.productoId));
        prod.stock -= item.cantidad;
      }
      ProductoRepository.saveAll(productosData);
      
      // Crear pedido
      const pedidos = PedidoRepository.getAll();
      const id = (pedidos.length ? Math.max(...pedidos.map(p => parseInt(p.id))) + 1 : 1).toString();
      const fecha = new Date().toISOString();
      const nuevo = { id, clienteId: parseInt(clienteId), productos, estado: 'Recibido', fecha };
      pedidos.push(nuevo);
      PedidoRepository.saveAll(pedidos);
      return nuevo;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  static cancelarPedido(id) {
    try {
      let pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) throw new Error('Pedido no encontrado');
      if (pedido.estado === 'Entregado') throw new Error('No se puede cancelar un pedido entregado');
      
      // Devolver stock
      const productos = ProductoRepository.getAll();
      for (const item of pedido.productos) {
        const prod = productos.find(p => p.id === parseInt(item.productoId));
        if (prod) prod.stock += item.cantidad;
      }
      ProductoRepository.saveAll(productos);
      
      // Eliminar pedido
      pedidos = pedidos.filter(p => p.id !== pedidoId);
      PedidoRepository.saveAll(pedidos);
      return pedido;
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      throw error;
    }
  }

  static editarPedido(id, productos) {
    try {
      let pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) throw new Error('Pedido no encontrado');
      if (pedido.estado === 'Entregado') throw new Error('No se puede editar un pedido entregado');
      
      // Devolver stock anterior
      const productosData = ProductoRepository.getAll();
      for (const item of pedido.productos) {
        const prod = productosData.find(p => p.id === parseInt(item.productoId));
        if (prod) prod.stock += item.cantidad;
      }
      
      // Validar y descontar stock nuevo
      for (const item of productos) {
        const prod = productosData.find(p => p.id === parseInt(item.productoId));
        if (!prod) throw new Error(`Producto ${item.productoId} no existe`);
        if (prod.stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${prod.nombre}`);
      }
      
      for (const item of productos) {
        const prod = productosData.find(p => p.id === parseInt(item.productoId));
        prod.stock -= item.cantidad;
      }
      ProductoRepository.saveAll(productosData);
      
      // Actualizar pedido
      pedido.productos = productos;
      PedidoRepository.saveAll(pedidos);
      return pedido;
    } catch (error) {
      console.error('Error al editar pedido:', error);
      throw error;
    }
  }

  static cambiarEstado(id, nuevoEstado) {
    try {
      let pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      const pedido = pedidos.find(p => p.id === pedidoId);
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
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }

  static validarPedido(id) {
    try {
      let pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) throw new Error('Pedido no encontrado');
      if (pedido.estado !== 'Recibido') throw new Error('Solo se pueden validar pedidos en estado Recibido');
      
      pedido.estado = 'En ruta';
      PedidoRepository.saveAll(pedidos);
      return pedido;
    } catch (error) {
      console.error('Error al validar pedido:', error);
      throw error;
    }
  }

  static asignarRepartidor(id, repartidor, unidad) {
    try {
      let pedidos = PedidoRepository.getAll();
      const pedidoId = parseInt(id);
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) throw new Error('Pedido no encontrado');
      if (pedido.estado !== 'En ruta') throw new Error('Solo se puede asignar repartidor a pedidos en ruta');
      
      pedido.repartidor = repartidor;
      pedido.unidad = unidad;
      PedidoRepository.saveAll(pedidos);
      return pedido;
    } catch (error) {
      console.error('Error al asignar repartidor:', error);
      throw error;
    }
  }
}

module.exports = PedidoService; 