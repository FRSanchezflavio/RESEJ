/**
 * Script para actualizar el rol de un usuario
 * Uso: node scripts/actualizar-rol-usuario.js <nombre_usuario> <rol>
 * Roles disponibles: administrador, usuario_consulta
 */

const db = require('../src/config/database');

async function actualizarRolUsuario(nombreUsuario, nuevoRol) {
  try {
    // Validar que el rol existe
    const rol = await db('roles').where('nombre', nuevoRol).first();

    if (!rol) {
      console.error(`❌ Error: El rol "${nuevoRol}" no existe`);
      console.log('Roles disponibles:');
      const roles = await db('roles').select('nombre', 'descripcion');
      console.table(roles);
      process.exit(1);
    }

    // Buscar el usuario
    const usuario = await db('usuarios')
      .where('usuario', nombreUsuario)
      .first();

    if (!usuario) {
      console.error(`❌ Error: El usuario "${nombreUsuario}" no existe`);
      process.exit(1);
    }

    // Actualizar el rol del usuario
    await db('usuarios').where('usuario', nombreUsuario).update({
      rol: nuevoRol,
      rol_id: rol.id,
    });

    console.log(`✅ Usuario "${nombreUsuario}" actualizado exitosamente`);
    console.log(`   Nuevo rol: ${nuevoRol} (ID: ${rol.id})`);
    console.log(`   Permisos:`);
    console.log(`   - Crear: ${rol.puede_crear ? '✅' : '❌'}`);
    console.log(`   - Editar: ${rol.puede_editar ? '✅' : '❌'}`);
    console.log(`   - Eliminar: ${rol.puede_eliminar ? '✅' : '❌'}`);
    console.log(`   - Consultar: ${rol.puede_consultar ? '✅' : '❌'}`);
    console.log('');
    console.log(
      '⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar sesión para que los cambios surtan efecto.'
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error.message);
    process.exit(1);
  }
}

// Verificar argumentos de línea de comandos
const [, , nombreUsuario, nuevoRol] = process.argv;

if (!nombreUsuario || !nuevoRol) {
  console.log(
    'Uso: node scripts/actualizar-rol-usuario.js <nombre_usuario> <rol>'
  );
  console.log('');
  console.log('Ejemplo:');
  console.log(
    '  node scripts/actualizar-rol-usuario.js DEVELOPER1 administrador'
  );
  console.log('');
  console.log('Roles disponibles: administrador, usuario_consulta');
  process.exit(1);
}

actualizarRolUsuario(nombreUsuario, nuevoRol);
