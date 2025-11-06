const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let adminToken = '';
let invitationToken = '';

async function testCompleteFlow() {
  console.log('\n=== PRUEBA COMPLETA DEL SISTEMA DE INVITACIONES ===\n');

  try {
    // PASO 1: Login como admin
    console.log('1️⃣  Haciendo login como administrador...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      usuario: 'admin',
      password: 'Admin2025!'
    });
    
    adminToken = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');
    console.log(`   Token: ${adminToken.substring(0, 20)}...`);

    // PASO 2: Crear una invitación
    console.log('\n2️⃣  Creando invitación de prueba...');
    const invitacionData = {
      email: `test${Date.now()}@example.com`,
      nombre_completo: 'Usuario de Prueba',
      rol: 'usuario_consulta',
      duracion_horas: 48
    };
    
    const createResponse = await axios.post(
      `${API_URL}/invitaciones`,
      invitacionData,
      { headers: { Authorization: `Bearer ${adminToken}` }}
    );
    
    invitationToken = createResponse.data.data.invitacion.token;
    const invitationUrl = createResponse.data.data.url;
    
    console.log('✅ Invitación creada exitosamente');
    console.log(`   Email: ${invitacionData.email}`);
    console.log(`   Token: ${invitationToken.substring(0, 30)}...`);
    console.log(`   URL: ${invitationUrl}`);

    // PASO 3: Validar el token (como usuario no autenticado)
    console.log('\n3️⃣  Validando token de invitación...');
    const validateResponse = await axios.get(
      `${API_URL}/public/invitaciones/${invitationToken}/validar`
    );
    
    console.log('✅ Token válido');
    console.log(`   Nombre: ${validateResponse.data.invitacion.nombre_completo}`);
    console.log(`   Rol: ${validateResponse.data.invitacion.rol}`);
    console.log(`   Expira: ${new Date(validateResponse.data.invitacion.fecha_expiracion).toLocaleString()}`);

    // PASO 4: Aceptar la invitación y crear usuario
    console.log('\n4️⃣  Aceptando invitación y creando usuario...');
    const acceptData = {
      username: `usuario_test_${Date.now()}`,
      password: 'TestPassword123!'
    };
    
    const acceptResponse = await axios.post(
      `${API_URL}/public/invitaciones/${invitationToken}/aceptar`,
      acceptData
    );
    
    console.log('✅ Usuario creado exitosamente');
    console.log(`   Username: ${acceptData.username}`);
    console.log(`   Rol asignado: ${acceptResponse.data.data.rol}`);

    // PASO 5: Login con el nuevo usuario
    console.log('\n5️⃣  Probando login con el nuevo usuario...');
    const newUserLogin = await axios.post(`${API_URL}/auth/login`, {
      usuario: acceptData.username,
      password: acceptData.password
    });
    
    console.log('✅ Login del nuevo usuario exitoso');
    console.log(`   Token: ${newUserLogin.data.data.accessToken.substring(0, 20)}...`);

    // PASO 6: Verificar que el token ya no se puede usar
    console.log('\n6️⃣  Verificando que el token no se pueda reutilizar...');
    try {
      await axios.post(
        `${API_URL}/public/invitaciones/${invitationToken}/aceptar`,
        {
          username: 'otro_usuario',
          password: 'OtraPassword123!'
        }
      );
      console.log('❌ ERROR: El token debería estar marcado como usado');
      throw new Error('El token no fue marcado como usado correctamente');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error?.includes('utilizada')) {
        console.log('✅ Token correctamente marcado como usado');
      } else if (err.message?.includes('no fue marcado')) {
        throw err;
      } else {
        throw err;
      }
    }

    // PASO 7: Listar invitaciones (como admin)
    console.log('\n7️⃣  Listando todas las invitaciones...');
    const listResponse = await axios.get(
      `${API_URL}/invitaciones`,
      { headers: { Authorization: `Bearer ${adminToken}` }}
    );
    
    console.log(`✅ Total de invitaciones: ${listResponse.data.data.length}`);
    const usedInvitations = listResponse.data.data.filter(inv => inv.usado);
    console.log(`   Usadas: ${usedInvitations.length}`);
    console.log(`   Pendientes: ${listResponse.data.data.length - usedInvitations.length}`);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('El sistema de invitaciones está funcionando correctamente:');
    console.log('  • Creación de invitaciones ✓');
    console.log('  • Validación de tokens ✓');
    console.log('  • Registro de usuarios ✓');
    console.log('  • Un solo uso por token ✓');
    console.log('  • Listado de invitaciones ✓');

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

testCompleteFlow();
