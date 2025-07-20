const ProductoRepository = require('../repositories/productoRepository');

class ProductoService {
  static getCatalogo() {
    return ProductoRepository.getAll();
  }

  static getProductoById(id) {
    const productos = ProductoRepository.getAll();
    return productos.find(p => p.id === id);
  }
}

module.exports = ProductoService; 