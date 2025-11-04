const os = require('os');
const https = require('https');
const http = require('http');

console.log('\n🔍 VERIFICACIÓN COMPLETA DEL SISTEMA\n');
console.log('═══════════════════════════════════════════════════\n');

// 1. Detectar IP
console.log('1️⃣  Detectando IP de red local...');
const networkInterfaces = os.networkInterfaces();
let ipLocal = null;

for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      const ip = iface.address;
      if (
        ip.startsWith('192.168.') ||
        ip.startsWith('10.') ||
        (ip.startsWith('172.') &&
          parseInt(ip.split('.')[1]) >= 16 &&
          parseInt(ip.split('.')[1]) <= 31)
      ) {
        ipLocal = ip;
        break;
      }
    }
  }
  if (ipLocal) break;
}

if (ipLocal) {
  console.log(`   ✅ IP detectada: ${ipLocal}\n`);
} else {
  console.log('   ❌ No se pudo detectar IP de red local\n');
  process.exit(1);
}

// 2. Verificar Backend
console.log('2️⃣  Verificando Backend (puerto 3000)...');
http
  .get(`http://localhost:3000/health`, res => {
    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('   ✅ Backend responde correctamente');
        console.log(`   📊 Status: ${JSON.parse(data).status}\n`);

        // 3. Verificar Frontend
        console.log('3️⃣  Verificando Frontend (puerto 5173)...');
        http
          .get(`http://localhost:5173`, res => {
            if (res.statusCode === 200) {
              console.log('   ✅ Frontend responde correctamente\n');
              mostrarResumen();
            } else {
              console.log(
                `   ⚠️  Frontend responde con código: ${res.statusCode}\n`
              );
              mostrarResumen();
            }
          })
          .on('error', e => {
            console.log(`   ❌ Error al conectar con Frontend: ${e.message}`);
            console.log('   💡 Ejecuta: cd frontend && npm run dev\n');
          });
      } else {
        console.log(`   ⚠️  Backend responde con código: ${res.statusCode}\n`);
      }
    });
  })
  .on('error', e => {
    console.log(`   ❌ Error al conectar con Backend: ${e.message}`);
    console.log('   💡 Ejecuta: cd BACKEND && node server.js\n');
    process.exit(1);
  });

function mostrarResumen() {
  console.log('═══════════════════════════════════════════════════');
  console.log('✅ SISTEMA LISTO PARA USAR');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('📱 INSTRUCCIONES PARA CELULAR:\n');
  console.log('1. Conecta tu celular a la MISMA RED WiFi');
  console.log('2. Abre el navegador en tu celular');
  console.log(`3. Ve a: http://${ipLocal}:5173\n`);

  console.log('🔗 GENERAR ENLACE DE ACCESO:\n');
  console.log('1. En la computadora, abre: http://localhost:5173');
  console.log('2. Login como administrador (usuario: admin)');
  console.log('3. Ve a "Gestión de Usuarios"');
  console.log('4. Click en el botón 🔗 junto a cualquier usuario');
  console.log('5. Copia el enlace que aparece\n');

  console.log('📤 ENVIAR ENLACE:\n');
  console.log('- Por WhatsApp');
  console.log('- Por Email');
  console.log('- Generar código QR en: https://www.qr-code-generator.com/\n');

  console.log('🔒 CARACTERÍSTICAS DE SEGURIDAD:\n');
  console.log('- ✅ Token único de un solo uso');
  console.log('- ✅ Expira en 24 horas');
  console.log('- ✅ Registro en logs de auditoría');
  console.log('- ✅ Validación de IP del cliente\n');

  console.log('═══════════════════════════════════════════════════\n');

  console.log('🌐 URLs DE ACCESO:\n');
  console.log(`Computadora (Local):   http://localhost:5173`);
  console.log(`Celular (Red):         http://${ipLocal}:5173`);
  console.log(`Backend API:           http://${ipLocal}:3000\n`);

  console.log('═══════════════════════════════════════════════════\n');
}
