const ProductoRepository = require('../repositories/productoRepository');

class ProductoService {
  static getCatalogo() {
    try {
      return ProductoRepository.getAll();
    } catch (error) {
      console.error('Error al obtener catálogo:', error);
      throw error;
    }
  }

  static getProductoById(id) {
    try {
      const productos = ProductoRepository.getAll();
      // Convertir id a número para comparación correcta
      const productoId = parseInt(id);
      console.log('Buscando producto con ID:', productoId, 'Tipo:', typeof productoId);
      console.log('Productos disponibles:', productos.map(p => ({ id: p.id, tipo: typeof p.id })));
      const producto = productos.find(p => p.id === productoId);
      console.log('Producto encontrado:', producto);
      return producto;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }
}

module.exports = ProductoService; 