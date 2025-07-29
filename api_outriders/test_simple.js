const axios = require('axios');

async function testConnection() {
  try {
    console.log('Probando conexión al servidor...');
    const response = await axios.get('http://localhost:3000/api/catalogo');
    console.log('✅ Conexión exitosa');
    console.log('Productos disponibles:', response.data.length);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('El servidor no está corriendo en puerto 3000');
    }
  }
}

testConnection(); 