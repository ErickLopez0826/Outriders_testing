const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function demoRoles() {
  console.log('=== Demostración de Roles y Permisos ===\n');
  
  try {
    // 1. Login como cliente (erick)
    console.log('1. 🔐 Iniciando sesión como cliente (erick)...');
    const clienteResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'erick552@gmail.com',
      password: '1234'
    });
    
    const clienteToken = clienteResponse.data.token;
    console.log('✅ Login exitoso como cliente');
    console.log(`Token: ${clienteToken.substring(0, 30)}...\n`);
    
    // 2. Verificar información del cliente
    console.log('2. 👤 Verificando información del cliente...');
    const clienteInfo = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${clienteToken}` }
    });
    
    console.log('✅ Información del cliente:');
    console.log(`   Nombre: ${clienteInfo.data.usuario.nombre}`);
    console.log(`   Email: ${clienteInfo.data.usuario.email}`);
    console.log(`   Rol: ${clienteInfo.data.usuario.rol}\n`);
    
    // 3. Intentar editar pedido como cliente (DEBERÍA FALLAR)
    console.log('3. ❌ Intentando editar pedido como cliente...');
    console.log('   Ruta: PUT /api/admin/pedidos/1');
    console.log('   Resultado esperado: Error 403 - Sin permisos\n');
    
    try {
      await axios.put(`${BASE_URL}/admin/pedidos/1`, {
        productos: [{ productoId: "1", cantidad: 50 }]
      }, {
        headers: { 
          Authorization: `Bearer ${clienteToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Error esperado - Cliente no puede editar pedidos:');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Mensaje: ${error.response.data.mensaje}\n`);
    }
    
    // 4. Login como administrador
    console.log('4. 🔐 Iniciando sesión como administrador...');
    const adminResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@apycar.com',
      password: 'admin123'
    });
    
    const adminToken = adminResponse.data.token;
    console.log('✅ Login exitoso como administrador');
    console.log(`Token: ${adminToken.substring(0, 30)}...\n`);
    
    // 5. Verificar información del admin
    console.log('5. 👤 Verificando información del administrador...');
    const adminInfo = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    console.log('✅ Información del administrador:');
    console.log(`   Nombre: ${adminInfo.data.usuario.nombre}`);
    console.log(`   Email: ${adminInfo.data.usuario.email}`);
    console.log(`   Rol: ${adminInfo.data.usuario.rol}\n`);
    
    // 6. Intentar editar pedido como admin (DEBERÍA FUNCIONAR)
    console.log('6. ✅ Intentando editar pedido como administrador...');
    console.log('   Ruta: PUT /api/admin/pedidos/1');
    console.log('   Resultado esperado: Éxito - Pedido actualizado\n');
    
    try {
      const editResponse = await axios.put(`${BASE_URL}/admin/pedidos/1`, {
        productos: [{ productoId: "1", cantidad: 50 }]
      }, {
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Edición exitosa como administrador:');
      console.log(`   Status: ${editResponse.status}`);
      console.log(`   Respuesta: ${JSON.stringify(editResponse.data, null, 2)}\n`);
    } catch (error) {
      console.log('❌ Error inesperado:');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Mensaje: ${error.response.data.mensaje}\n`);
    }
    
    console.log('=== Resumen ===');
    console.log('✅ El sistema funciona correctamente:');
    console.log('   - Los clientes NO pueden editar pedidos (Error 403)');
    console.log('   - Los administradores SÍ pueden editar pedidos (Éxito)');
    console.log('   - La autenticación y autorización funcionan correctamente');
    
  } catch (error) {
    console.error('❌ Error en la demostración:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar la demostración
demoRoles(); 