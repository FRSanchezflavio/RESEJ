/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('refresh_tokens', function (table) {
    table.bigIncrements('id').primary();
    table.bigInteger('usuario_id').unsigned().notNullable();
    table.string('token', 500).notNullable().unique();
    table.timestamp('fecha_expiracion', { useTz: true }).notNullable();
    table.timestamp('fecha_creacion', { useTz: true }).defaultTo(knex.fn.now());
    table.boolean('revocado').defaultTo(false);
    table.specificType('ip_address', 'inet');

    // Foreign keys
    table
      .foreign('usuario_id')
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE');

    // Indexes
    table.index('usuario_id', 'idx_refresh_tokens_usuario');
    table.index('token', 'idx_refresh_tokens_token');
    table.index('revocado', 'idx_refresh_tokens_revocado');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
