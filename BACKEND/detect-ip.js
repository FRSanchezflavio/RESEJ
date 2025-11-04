const os = require('os');

console.log('\n🔍 DETECTANDO IPs DE RED...\n');

const networkInterfaces = os.networkInterfaces();
const ips = [];

for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      const isLocalNetwork =
        iface.address.startsWith('192.168.') ||
        iface.address.startsWith('10.') ||
        (iface.address.startsWith('172.') &&
          parseInt(iface.address.split('.')[1]) >= 16 &&
          parseInt(iface.address.split('.')[1]) <= 31);

      ips.push({
        interfaz: interfaceName,
        ip: iface.address,
        redLocal: isLocalNetwork,
      });
    }
  }
}

console.log('📋 IPs ENCONTRADAS:\n');

if (ips.length === 0) {
  console.log('❌ No se encontraron IPs de red disponibles');
  console.log('   Asegúrate de estar conectado a una red WiFi o Ethernet\n');
} else {
  ips.forEach((info, index) => {
    const emoji = info.redLocal ? '✅' : '⚠️';
    console.log(`${emoji} ${info.interfaz}`);
    console.log(`   IP: ${info.ip}`);
    console.log(
      `   Tipo: ${info.redLocal ? 'Red Local (Recomendado)' : 'Otra red'}\n`
    );
  });

  const ipRecomendada = ips.find(info => info.redLocal)?.ip || ips[0].ip;
  const puerto = process.env.FRONTEND_PORT || '5173';

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 PARA ACCEDER DESDE TU CELULAR:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`1. Asegúrate de que tu celular esté en la MISMA RED WiFi`);
  console.log(`2. En el archivo BACKEND/.env, configura:\n`);
  console.log(`   FRONTEND_URL=http://${ipRecomendada}:${puerto}\n`);
  console.log(`3. Reinicia el servidor backend`);
  console.log(`4. En tu celular, abre: http://${ipRecomendada}:${puerto}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
