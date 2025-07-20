class Usuario {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password; // Hasheada en producción
  }
}

module.exports = Usuario; 