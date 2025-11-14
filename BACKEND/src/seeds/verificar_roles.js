/**
 * Seed para verificar y mostrar los roles existentes
 */
exports.seed = async function (knex) {
  console.log('\n📋 Verificando roles en la base de datos...\n');

  const roles = await knex('roles').select('*').orderBy('id');

  if (roles.length === 0) {
    console.log('⚠️  No se encontraron roles en la base de datos');
    return;
  }

  console.log('Roles encontrados:');
  console.log('═'.repeat(80));

  roles.forEach(rol => {
    console.log(`\nID: ${rol.id}`);
    console.log(`Nombre: ${rol.nombre}`);
    console.log(`Descripción: ${rol.descripcion || 'Sin descripción'}`);
    console.log('Permisos:');
    console.log(`  - Crear: ${rol.puede_crear ? '✓' : '✗'}`);
    console.log(`  - Editar: ${rol.puede_editar ? '✓' : '✗'}`);
    console.log(`  - Eliminar: ${rol.puede_eliminar ? '✓' : '✗'}`);
    console.log(`  - Consultar: ${rol.puede_consultar ? '✓' : '✗'}`);
  });

  console.log('\n' + '═'.repeat(80));
  console.log(`\n✓ Total de roles: ${roles.length}\n`);

  // Verificar si el rol usuario_estandar existe
  const rolEstandar = roles.find(r => r.nombre === 'usuario_estandar');
  if (rolEstandar) {
    console.log(
      '✓ El rol "usuario_estandar" está configurado correctamente (ID: ' +
        rolEstandar.id +
        ')'
    );
    console.log(
      '  Los nuevos usuarios tendrán permisos para crear y editar registros\n'
    );
  } else {
    console.log('⚠️  ADVERTENCIA: El rol "usuario_estandar" no existe');
    console.log('  Por favor ejecuta la migración: npx knex migrate:latest\n');
  }
};
