/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('invitaciones_usuarios', table => {
    table.increments('id').primary();
    table.string('email', 255).notNullable();
    table.string('nombre_completo', 255).notNullable();
    table.string('rol', 50).notNullable().defaultTo('usuario_consulta');
    table.string('token', 255).notNullable().unique();
    table.integer('usuario_creador_id').unsigned().notNullable();
    table
      .foreign('usuario_creador_id')
      .references('usuarios.id')
      .onDelete('CASCADE');
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
    table.timestamp('fecha_expiracion').notNullable();
    table.boolean('usado').defaultTo(false);
    table.integer('usuario_creado_id').unsigned().nullable();
    table
      .foreign('usuario_creado_id')
      .references('usuarios.id')
      .onDelete('SET NULL');
    table.timestamp('fecha_uso').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('invitaciones_usuarios');
};
