class Pedido {
  constructor(id, clienteId, productos, estado, fecha) {
    this.id = id;
    this.clienteId = clienteId;
    this.productos = productos; // [{ productoId, cantidad }]
    this.estado = estado; // Recibido, En ruta, Entregado
    this.fecha = fecha;
  }
}

module.exports = Pedido; 