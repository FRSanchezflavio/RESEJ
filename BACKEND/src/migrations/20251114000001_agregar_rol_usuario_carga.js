/**
 * Migración para agregar rol de usuario de carga
 * Este rol tiene permiso solo para crear (cargar) nuevos secuestros
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Verificar si ya existe el rol 'usuario_carga'
  const rolExistente = await knex('roles')
    .where({ nombre: 'usuario_carga' })
    .first();

  if (!rolExistente) {
    // Simplemente insertar el nuevo rol sin modificar IDs existentes
    await knex('roles').insert({
      nombre: 'usuario_carga',
      descripcion:
        'Usuario que solo puede cargar nuevos secuestros',
      puede_crear: true,
      puede_editar: false,
      puede_eliminar: false,
      puede_consultar: true,
    });

    console.log('✓ Rol usuario_carga creado exitosamente');
    
    // Obtener el ID del rol recién creado
    const nuevoRol = await knex('roles')
      .where({ nombre: 'usuario_carga' })
      .first();
    
    console.log(`  ID asignado: ${nuevoRol.id}`);
  } else {
    console.log('⚠️ Rol usuario_carga ya existe con ID:', rolExistente.id);
  }
};/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Eliminar el rol usuario_carga
  await knex('roles').where({ nombre: 'usuario_carga' }).del();
  console.log('✓ Rol usuario_carga eliminado');
};
