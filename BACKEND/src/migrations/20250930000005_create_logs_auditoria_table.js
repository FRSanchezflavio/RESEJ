/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('logs_auditoria', function (table) {
    table.bigIncrements('id').primary();
    table.bigInteger('usuario_id').unsigned();
    table.string('accion', 100).notNullable();
    table.string('recurso_tipo', 100);
    table.bigInteger('recurso_id');
    table.jsonb('detalles');
    table.specificType('ip_address', 'inet');
    table.timestamp('fecha_hora', { useTz: true }).defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('usuario_id')
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');

    // Indexes
    table.index('usuario_id', 'idx_logs_usuario');
    table.index('fecha_hora', 'idx_logs_fecha');
    table.index('accion', 'idx_logs_accion');
    table.index('recurso_tipo', 'idx_logs_recurso_tipo');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('logs_auditoria');
};
