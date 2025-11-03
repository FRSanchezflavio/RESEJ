/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('roles', function (table) {
      table.increments('id').primary();
      table.string('nombre', 50).notNullable().unique();
      table.string('descripcion', 255);
      table.boolean('puede_crear').defaultTo(false);
      table.boolean('puede_editar').defaultTo(false);
      table.boolean('puede_eliminar').defaultTo(false);
      table.boolean('puede_consultar').defaultTo(true);
      table.timestamps(true, true);
    })
    .then(() => {
      // Insertar roles por defecto
      return knex('roles').insert([
        {
          nombre: 'administrador',
          descripcion: 'Acceso completo al sistema',
          puede_crear: true,
          puede_editar: true,
          puede_eliminar: true,
          puede_consultar: true,
        },
        {
          nombre: 'usuario_consulta',
          descripcion: 'Solo puede buscar y visualizar información',
          puede_crear: false,
          puede_editar: false,
          puede_eliminar: false,
          puede_consultar: true,
        },
      ]);
    })
    .then(() => {
      // Agregar columna rol_id a la tabla usuarios si no existe
      return knex.schema.hasColumn('usuarios', 'rol_id').then(exists => {
        if (!exists) {
          return knex.schema.table('usuarios', function (table) {
            table
              .integer('rol_id')
              .unsigned()
              .references('id')
              .inTable('roles')
              .defaultTo(1);
          });
        }
      });
    })
    .then(() => {
      // Actualizar usuarios existentes para que tengan rol de administrador
      return knex('usuarios').update({ rol_id: 1 });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .hasColumn('usuarios', 'rol_id')
    .then(exists => {
      if (exists) {
        return knex.schema.table('usuarios', function (table) {
          table.dropColumn('rol_id');
        });
      }
    })
    .then(() => {
      return knex.schema.dropTableIfExists('roles');
    });
};
