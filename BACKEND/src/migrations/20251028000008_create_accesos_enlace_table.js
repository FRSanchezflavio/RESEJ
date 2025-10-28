/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('accesos_enlace');
  if (exists) return;

  await knex.schema.createTable('accesos_enlace', table => {
    table.bigIncrements('id').primary();
    table
      .bigInteger('enlace_id')
      .unsigned()
      .notNullable();
    table
      .timestamp('fecha_acceso', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .string('ip_address', 64)
      .nullable();
    table
      .text('user_agent')
      .nullable();
    table
      .string('resultado', 32)
      .notNullable()
      .defaultTo('permitido')
      .comment('permitido | denegado | expirado | revocado');
    table.text('detalle').nullable();

    table
      .foreign('enlace_id')
      .references('id')
      .inTable('enlaces_compartidos')
      .onDelete('CASCADE');

    table.index('enlace_id', 'idx_accesos_enlace_enlace');
    table.index('fecha_acceso', 'idx_accesos_enlace_fecha');
    table.index(['enlace_id', 'resultado'], 'idx_accesos_enlace_resultado');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const exists = await knex.schema.hasTable('accesos_enlace');
  if (!exists) return;

  await knex.schema.dropTable('accesos_enlace');
};
