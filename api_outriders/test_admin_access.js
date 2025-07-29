const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAdminAccess() {
  try {
    console.log('=== Prueba de acceso de administrador ===\n');
    
    // 1. Login como admin
    console.log('1. Iniciando sesión como administrador...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@apycar.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Login exitoso como admin');
    console.log('Token:', adminToken.substring(0, 50) + '...\n');
    
    // 2. Verificar información del usuario admin
    console.log('2. Verificando información del usuario admin...');
    const adminInfoResponse = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    console.log('✅ Información del admin:', adminInfoResponse.data.usuario);
    console.log('');
    
    // 3. Intentar editar pedido como admin
    console.log('3. Intentando editar pedido como admin...');
    const editResponse = await axios.put(`${BASE_URL}/admin/pedidos/1`, {
      productos: [
        {
          productoId: "1",
          cantidad: 50
        }
      ]
    }, {
      headers: { 
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Edición exitosa como admin');
    console.log('Respuesta:', editResponse.data);
    console.log('');
    
    // 4. Login como cliente (erick)
    console.log('4. Iniciando sesión como cliente (erick)...');
    const clienteLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'erick552@gmail.com',
      password: '1234'
    });
    
    const clienteToken = clienteLoginResponse.data.token;
    console.log('✅ Login exitoso como cliente');
    console.log('Token:', clienteToken.substring(0, 50) + '...\n');
    
    // 5. Verificar información del usuario cliente
    console.log('5. Verificando información del usuario cliente...');
    const clienteInfoResponse = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${clienteToken}` }
    });
    
    console.log('✅ Información del cliente:', clienteInfoResponse.data.usuario);
    console.log('');
    
    // 6. Intentar editar pedido como cliente (debería fallar)
    console.log('6. Intentando editar pedido como cliente (debería fallar)...');
    try {
      await axios.put(`${BASE_URL}/admin/pedidos/1`, {
        productos: [
          {
            productoId: "1",
            cantidad: 50
          }
        ]
      }, {
        headers: { 
          Authorization: `Bearer ${clienteToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('❌ Error esperado - Cliente no puede editar pedidos:');
      console.log('Status:', error.response.status);
      console.log('Mensaje:', error.response.data.mensaje);
    }
    
  } catch (error) {
    console.error('Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar la prueba
testAdminAccess(); 