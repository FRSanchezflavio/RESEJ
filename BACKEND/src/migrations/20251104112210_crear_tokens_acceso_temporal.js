/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tokens_acceso_temporal', function (table) {
    table.bigIncrements('id').primary();
    table
      .bigInteger('usuario_id')
      .unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE')
      .notNullable();
    table.string('token', 255).unique().notNullable();
    table.boolean('usado').defaultTo(false);
    table.timestamp('fecha_generacion').defaultTo(knex.fn.now());
    table.timestamp('fecha_expiracion').notNullable();
    table
      .bigInteger('generado_por')
      .unsigned()
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');
    table.string('ip_uso', 50);
    table.timestamp('fecha_uso');
    table.timestamps(true, true);

    // Índices para mejorar rendimiento
    table.index('token', 'idx_tokens_acceso_token');
    table.index('usuario_id', 'idx_tokens_acceso_usuario');
    table.index(['token', 'usado'], 'idx_tokens_acceso_validacion');
    table.index('fecha_expiracion', 'idx_tokens_acceso_expiracion');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tokens_acceso_temporal');
};
