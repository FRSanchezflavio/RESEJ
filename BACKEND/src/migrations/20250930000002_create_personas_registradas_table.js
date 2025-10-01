/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('personas_registradas', function(table) {
    table.bigIncrements('id').primary();
    table.string('nombre', 100).notNullable();
    table.string('apellido', 100).notNullable();
    table.string('dni', 20);
    table.date('fecha_nacimiento');
    table.text('domicilio');
    table.string('telefono', 50);
    table.string('email', 100);
    table.text('observaciones');
    table.timestamp('fecha_registro', { useTz: true }).defaultTo(knex.fn.now());
    
    // Indexes
    table.index('dni', 'idx_personas_dni');
    table.index(['nombre', 'apellido'], 'idx_personas_nombre_apellido');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('personas_registradas');
};
