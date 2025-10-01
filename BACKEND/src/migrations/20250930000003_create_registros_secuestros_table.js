/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Crear tipo enum para estado_causa
  await knex.raw(`
    CREATE TYPE estado_causa_enum AS ENUM ('abierta', 'cerrada', 'en_proceso');
  `);

  return knex.schema.createTable('registros_secuestros', function (table) {
    table.bigIncrements('id').primary();
    table.bigInteger('persona_id').unsigned().notNullable();

    // Campos principales del formulario
    table.date('fecha_ingreso').notNullable();
    table.string('ufi', 100);
    table.string('numero_legajo', 100);
    table.text('seccion_que_interviene');
    table.text('detalle_secuestro');
    table.string('numero_protocolo', 100);
    table.text('cadena_custodia');
    table.string('nro_folio', 50);
    table.string('nro_libro_secuestro', 50);
    table.string('of_a_cargo', 150);
    table.text('tramite');

    // Campos adicionales heredados
    table.string('tipo_delito', 150);
    table.date('fecha_delito');
    table.text('lugar_delito');
    table.text('descripcion');
    table
      .specificType('estado_causa', 'estado_causa_enum')
      .defaultTo('en_proceso');
    table.string('numero_causa', 50);
    table.string('juzgado', 150);

    // Auditoría
    table.bigInteger('usuario_carga').unsigned();
    table.timestamp('fecha_carga', { useTz: true }).defaultTo(knex.fn.now());

    // Foreign keys
    table
      .foreign('persona_id')
      .references('id')
      .inTable('personas_registradas')
      .onDelete('CASCADE');
    table
      .foreign('usuario_carga')
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');

    // Indexes
    table.index('persona_id', 'idx_registros_persona');
    table.index('fecha_ingreso', 'idx_registros_fecha_ingreso');
    table.index('numero_legajo', 'idx_registros_numero_legajo');
    table.index('usuario_carga', 'idx_registros_usuario_carga');
    table.index('estado_causa', 'idx_registros_estado_causa');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('registros_secuestros');
  return knex.raw('DROP TYPE IF EXISTS estado_causa_enum;');
};
