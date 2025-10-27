const bcrypt = require('bcrypt');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

async function resetAdminPassword() {
  try {
    console.log('🔄 Reseteando contraseña del admin...');
    
    const newPassword = 'Admin2025!';
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const result = await db('usuarios')
      .where({ usuario: 'admin' })
      .update({ password_hash: passwordHash });
    
    if (result > 0) {
      console.log('✅ Contraseña actualizada exitosamente');
      console.log('   Usuario: admin');
      console.log('   Contraseña: Admin2025!');
    } else {
      console.log('❌ No se encontró el usuario admin');
    }
    
    await db.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

resetAdminPassword();
