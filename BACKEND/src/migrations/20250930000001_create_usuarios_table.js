/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('usuarios', function(table) {
    table.bigIncrements('id').primary();
    table.string('usuario', 50).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('nombre', 100).notNullable();
    table.string('apellido', 100).notNullable();
    table.string('rol', 32).notNullable().defaultTo('usuario_consulta')
      .comment('Valores: administrador, usuario_consulta');
    table.boolean('activo').defaultTo(true);
    table.timestamp('fecha_creacion', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('ultimo_acceso', { useTz: true });
    table.bigInteger('creado_por').unsigned();
    
    // Foreign key
    table.foreign('creado_por').references('id').inTable('usuarios').onDelete('SET NULL');
    
    // Indexes
    table.index('rol', 'idx_usuarios_rol');
    table.index('activo', 'idx_usuarios_activo');
    table.index('creado_por', 'idx_usuarios_creado_por');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('usuarios');
};
