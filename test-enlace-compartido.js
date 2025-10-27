// Colores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const BASE_URL = 'http://127.0.0.1:3000/api';
const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpb19pZCI6MSwibm9tYnJlIjoiQWRtaW4iLCJhcGVsbGlkbyI6IkFkbWluaXN0cmFkb3IiLCJyb2wiOjEsImVtYWlsIjoiYWRtaW5AcmVzZWouY29tIiwiaWF0IjoxNzMwMDk0NDEwLCJleHAiOjE3MzAxODA4MTB9.VRJrnxW1R1Zcq8nQDhUAD0kIH1UKdSxJ8C9dPf6XzUU';

let testsPassed = 0;
let testsFailed = 0;

// Utilidad para imprimir
function log(title, message, type = 'info') {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warning: '⚠️ ',
    test: '🧪',
  };

  const colorMap = {
    info: colors.blue,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    test: colors.cyan,
  };

  console.log(`${colorMap[type]}${icons[type]} ${title}${colors.reset}`);
  if (message) console.log(`   ${message}`);
}

async function makeRequest(method, url, body = null, includeAuth = true) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (includeAuth) {
    options.headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.message && error.status !== undefined) {
      throw error;
    }
    throw new Error(`Conexión fallida: ${error.message}`);
  }
}

async function test(name, fn) {
  process.stdout.write(`${colors.cyan}🧪 ${name}${colors.reset}... `);
  try {
    await fn();
    console.log(`${colors.green}✅ PASSED${colors.reset}`);
    testsPassed++;
  } catch (error) {
    console.log(`${colors.red}❌ FAILED${colors.reset}`);
    console.log(`   ${colors.red}${error.message}${colors.reset}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(
    `${colors.cyan}   PRUEBAS COMPLETAS - SISTEMA DE ENLACES COMPARTIDOS${colors.reset}`
  );
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  let registroId = null;
  let enlaceId = null;
  let enlaceToken = null;

  // TEST 1: Obtener registros disponibles
  await test('1. Obtener lista de registros', async () => {
    const response = await makeRequest('GET', `${BASE_URL}/registros`);

    if (!response.data || response.data.length === 0) {
      throw new Error('No hay registros disponibles en la base de datos');
    }

    registroId = response.data[0].id;
    log(`Registro seleccionado: ID ${registroId}`, '', 'success');
  });

  // TEST 2: Crear enlace compartido
  await test('2. Crear enlace compartido', async () => {
    const payload = {
      registro_id: registroId,
      duracion_horas: 24,
      max_accesos: 5,
      descripcion: 'Enlace de prueba',
      requiere_contrasena: false,
    };

    const response = await makeRequest(
      'POST',
      `${BASE_URL}/enlaces-compartidos`,
      payload
    );

    if (!response.data.id || !response.data.token) {
      throw new Error('Respuesta inválida: falta ID o token');
    }

    enlaceId = response.data.id;
    enlaceToken = response.data.token;

    log(
      `Enlace creado exitosamente`,
      `ID: ${enlaceId}, Token: ${enlaceToken}`,
      'success'
    );
  });

  // TEST 3: Listar enlaces del usuario
  await test('3. Listar enlaces del usuario', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos`
    );

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Respuesta inválida: no es un array');
    }

    if (response.data.length === 0) {
      throw new Error('No hay enlaces en la lista (debería haber al menos 1)');
    }

    const enlaceCreado = response.data.find(e => e.id === enlaceId);
    if (!enlaceCreado) {
      throw new Error('El enlace creado no aparece en la lista');
    }

    log(`Se encontraron ${response.data.length} enlace(s)`, '', 'success');
  });

  // TEST 4: Obtener detalles del enlace
  await test('4. Obtener detalles del enlace', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos/${enlaceId}`
    );

    if (!response.data || response.data.id !== enlaceId) {
      throw new Error('Respuesta inválida o ID no coincide');
    }

    log(
      `Enlace recuperado correctamente`,
      `Token: ${response.data.token}`,
      'success'
    );
  });

  // TEST 5: Obtener URL del QR
  await test('5. Obtener URL del enlace (para QR)', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos/${enlaceId}/qr`
    );

    if (!response.data.url || !response.data.token) {
      throw new Error('Respuesta inválida: falta URL o token');
    }

    const url = response.data.url;
    log(`URL del enlace generada`, url, 'success');
  });

  // TEST 6: Obtener estadísticas del enlace
  await test('6. Obtener estadísticas del enlace', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos/${enlaceId}/estadisticas`
    );

    if (!response.data) {
      throw new Error('Respuesta inválida: falta data');
    }

    const { accesos_actuales, max_accesos, activo } = response.data;
    log(
      `Estadísticas recuperadas`,
      `Accesos: ${accesos_actuales}/${
        max_accesos || 'ilimitado'
      }, Activo: ${activo}`,
      'success'
    );
  });

  // TEST 7: Acceder al enlace público (sin autenticación)
  await test('7. Acceder al enlace público (sin autenticación)', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos/publico/${enlaceToken}`,
      null,
      false
    );

    if (!response.data || response.data.id !== enlaceId) {
      throw new Error('No se puede acceder al enlace público');
    }

    log(
      `Acceso público exitoso`,
      `Registro ID: ${response.data.registro_id}`,
      'success'
    );
  });

  // TEST 8: Verificar que el contador de accesos aumentó
  await test('8. Verificar contador de accesos incrementado', async () => {
    const response = await makeRequest(
      'GET',
      `${BASE_URL}/enlaces-compartidos/${enlaceId}/estadisticas`
    );

    const accesos = response.data.accesos_actuales;
    if (accesos < 1) {
      throw new Error('El contador de accesos no se incrementó');
    }

    log(
      `Contador actualizado correctamente`,
      `Accesos registrados: ${accesos}`,
      'success'
    );
  });

  // TEST 9: Revocar enlace
  await test('9. Revocar acceso al enlace', async () => {
    const response = await makeRequest(
      'POST',
      `${BASE_URL}/enlaces-compartidos/${enlaceId}/revocar`,
      {}
    );

    if (!response.success) {
      throw new Error('Error al revocar enlace');
    }

    log(`Enlace revocado exitosamente`, '', 'success');
  });

  // TEST 10: Intentar acceder al enlace revocado
  await test('10. Intentar acceder a enlace revocado (debe fallar)', async () => {
    try {
      await makeRequest(
        'GET',
        `${BASE_URL}/enlaces-compartidos/publico/${enlaceToken}`,
        null,
        false
      );
      throw new Error('El enlace revocado sigue siendo accesible (no debería)');
    } catch (error) {
      if (error.status === 404) {
        log(`Verificación correcta: enlace rechazado`, '', 'success');
      } else if (error.message.includes('no debería')) {
        throw error;
      } else {
        log(`Verificación correcta: enlace inaccesible`, '', 'success');
      }
    }
  });

  // TEST 11: Crear enlace con múltiples opciones
  await test('11. Crear enlace sin contraseña (verificar modelo)', async () => {
    const payload = {
      registro_id: registroId,
      duracion_horas: 12,
      max_accesos: 3,
      descripcion: 'Enlace sin contraseña',
      requiere_contrasena: false,
    };

    const response = await makeRequest(
      'POST',
      `${BASE_URL}/enlaces-compartidos`,
      payload
    );

    if (!response.data.token) {
      throw new Error('Falta el token en la respuesta');
    }

    log(
      `Enlace sin contraseña creado`,
      `Token: ${response.data.token}`,
      'success'
    );
  });

  // TEST 12: Crear enlace con validación de duracion
  await test('12. Crear enlace con duración personalizada', async () => {
    const payload = {
      registro_id: registroId,
      duracion_horas: 48,
      max_accesos: 10,
      descripcion: 'Enlace de 48 horas',
      requiere_contrasena: false,
    };

    const response = await makeRequest(
      'POST',
      `${BASE_URL}/enlaces-compartidos`,
      payload
    );

    const enlace = response.data;
    if (!enlace.fecha_expiracion) {
      throw new Error('No se calculó la fecha de expiración');
    }

    log(
      `Enlace con duración personalizada`,
      `Expira: ${enlace.fecha_expiracion}`,
      'success'
    );
  });

  // Resumen final
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}   RESUMEN DE PRUEBAS${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.green}✅ PASADAS: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}❌ FALLIDAS: ${testsFailed}${colors.reset}`);
  console.log(
    `${colors.cyan}📊 TOTAL: ${testsPassed + testsFailed}${colors.reset}`
  );
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  if (testsFailed === 0) {
    console.log(
      `${colors.green}🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(
      `${colors.red}⚠️  ${testsFailed} prueba(s) fallaron. Revisa los errores arriba.${colors.reset}\n`
    );
    process.exit(1);
  }
}

// Ejecutar pruebas
runTests().catch(error => {
  console.error(`${colors.red}Error fatal:${colors.reset}`, error);
  process.exit(1);
});
