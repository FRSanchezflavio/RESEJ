/**
 * Migración para agregar rol de usuario estándar
 * Este rol tiene permisos de crear, editar y consultar pero no eliminar
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Verificar si ya existe el rol 'usuario_estandar'
  const rolExistente = await knex('roles')
    .where({ nombre: 'usuario_estandar' })
    .first();

  if (!rolExistente) {
    // Simplemente insertar el nuevo rol sin modificar IDs existentes
    await knex('roles').insert({
      nombre: 'usuario_estandar',
      descripcion:
        'Usuario con permisos para crear, editar y consultar registros',
      puede_crear: true,
      puede_editar: true,
      puede_eliminar: false,
      puede_consultar: true,
    });

    console.log('✓ Rol usuario_estandar creado exitosamente');

    // Obtener el ID del rol recién creado
    const nuevoRol = await knex('roles')
      .where({ nombre: 'usuario_estandar' })
      .first();

    console.log(`  ID asignado: ${nuevoRol.id}`);
  } else {
    console.log('⚠️ Rol usuario_estandar ya existe con ID:', rolExistente.id);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Eliminar el rol usuario_estandar
  await knex('roles').where({ nombre: 'usuario_estandar' }).del();
  console.log('✓ Rol usuario_estandar eliminado');
};
