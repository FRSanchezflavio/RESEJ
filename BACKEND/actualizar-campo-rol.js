/**
 * Script para sincronizar el campo 'rol' de usuarios con el nombre del rol de la tabla roles
 * Esto corrige usuarios que tienen rol_id actualizado pero el campo 'rol' desactualizado
 */

require('dotenv').config();
const db = require('./src/config/database');

async function actualizarCampoRol() {
  try {
    console.log('🔄 Sincronizando campo rol con tabla roles...\n');

    // Obtener todos los usuarios con sus roles
    const usuarios = await db('usuarios')
      .select(
        'usuarios.id',
        'usuarios.usuario',
        'usuarios.rol',
        'usuarios.rol_id',
        'roles.nombre as rol_nombre'
      )
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id');

    console.log(`📊 Usuarios encontrados: ${usuarios.length}\n`);

    let actualizados = 0;

    for (const usuario of usuarios) {
      if (
        usuario.rol_id &&
        usuario.rol_nombre &&
        usuario.rol !== usuario.rol_nombre
      ) {
        console.log(`🔧 Actualizando usuario: ${usuario.usuario}`);
        console.log(`   Rol actual: "${usuario.rol}"`);
        console.log(`   Rol correcto: "${usuario.rol_nombre}"`);

        await db('usuarios')
          .where('id', usuario.id)
          .update({ rol: usuario.rol_nombre });

        console.log('   ✅ Actualizado\n');
        actualizados++;
      } else if (!usuario.rol_id) {
        console.log(`⚠️  Usuario ${usuario.usuario} sin rol_id asignado\n`);
      }
    }

    console.log('═'.repeat(50));
    console.log(`✅ Proceso completado`);
    console.log(`   Total usuarios: ${usuarios.length}`);
    console.log(`   Actualizados: ${actualizados}`);
    console.log('═'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar roles:', error);
    process.exit(1);
  }
}

actualizarCampoRol();
