const http = require('http');

// Función para hacer peticiones HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Función para probar endpoints
async function testEndpoints() {
  console.log('🧪 Iniciando pruebas de la API...\n');

  try {
    // 1. Probar GET /api/catalogo
    console.log('1. Probando GET /api/catalogo...');
    const catalogo = await makeRequest('/api/catalogo');
    console.log(`   Status: ${catalogo.statusCode}`);
    console.log(`   Productos encontrados: ${catalogo.body.length}`);
    console.log('   ✅ Catálogo funciona correctamente\n');

    // 2. Probar GET /api/productos/1
    console.log('2. Probando GET /api/productos/1...');
    const producto = await makeRequest('/api/productos/1');
    console.log(`   Status: ${producto.statusCode}`);
    if (producto.statusCode === 200) {
      console.log(`   Producto: ${producto.body.nombre}`);
      console.log('   ✅ Producto por ID funciona correctamente\n');
    } else {
      console.log(`   Error: ${producto.body.mensaje}`);
      console.log('   ❌ Producto por ID no funciona\n');
    }

    // 3. Probar POST /api/login
    console.log('3. Probando POST /api/login...');
    const loginData = {
      email: 'contacto@loshermanos.com',
      password: 'cliente123'
    };
    const login = await makeRequest('/api/login', 'POST', loginData);
    console.log(`   Status: ${login.statusCode}`);
    if (login.statusCode === 200) {
      console.log('   ✅ Login funciona correctamente');
      console.log(`   Token: ${login.body.token.substring(0, 20)}...\n`);
    } else {
      console.log(`   Error: ${login.body.mensaje}`);
      console.log('   ❌ Login no funciona\n');
    }

    // 4. Probar POST /api/register
    console.log('4. Probando POST /api/register...');
    const registerData = {
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '5551234567',
      password: 'test123'
    };
    const register = await makeRequest('/api/register', 'POST', registerData);
    console.log(`   Status: ${register.statusCode}`);
    if (register.statusCode === 201) {
      console.log('   ✅ Register funciona correctamente\n');
    } else {
      console.log(`   Error: ${register.body.mensaje}`);
      console.log('   ❌ Register no funciona\n');
    }

    console.log('🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testEndpoints(); 