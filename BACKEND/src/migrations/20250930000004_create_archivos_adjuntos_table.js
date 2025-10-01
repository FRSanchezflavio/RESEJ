/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('archivos_adjuntos', function(table) {
    table.bigIncrements('id').primary();
    table.bigInteger('registro_id').unsigned().notNullable();
    table.string('nombre_original', 255).notNullable();
    table.string('nombre_archivo', 255).notNullable().unique();
    table.text('ruta_archivo').notNullable();
    table.string('tipo_mime', 100);
    table.bigInteger('tamano_bytes');
    table.timestamp('fecha_subida', { useTz: true }).defaultTo(knex.fn.now());
    table.bigInteger('subido_por').unsigned();
    
    // Foreign keys
    table.foreign('registro_id').references('id').inTable('registros_secuestros').onDelete('CASCADE');
    table.foreign('subido_por').references('id').inTable('usuarios').onDelete('SET NULL');
    
    // Indexes
    table.index('registro_id', 'idx_archivos_registro');
    table.index('nombre_archivo', 'idx_archivos_nombre');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('archivos_adjuntos');
};
