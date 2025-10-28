/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('enlaces_compartidos');
  if (exists) return;

  await knex.schema.createTable('enlaces_compartidos', table => {
    table.bigIncrements('id').primary();
    table
      .string('token', 64)
      .notNullable()
      .unique()
      .comment('Token público que identifica el enlace compartido');
    table
      .bigInteger('registro_id')
      .unsigned()
      .nullable()
      .comment('Registro asociado al enlace');
    table
      .bigInteger('usuario_creador_id')
      .unsigned()
      .nullable()
      .comment('Usuario que generó el enlace');
    table
      .string('tipo', 32)
      .notNullable()
      .defaultTo('registro')
      .comment('registro | persona | mixto (flexible por si se amplía)');
    table.text('descripcion').nullable();
    table.boolean('requiere_contrasena').notNullable().defaultTo(false);
    table
      .string('contrasena_hash', 255)
      .nullable()
      .comment('Hash de la contraseña opcional para acceder al enlace');
    table
      .string('usuario_temporal_usuario', 100)
      .nullable()
      .unique()
      .comment('Usuario provisorio generado para navegación restringida');
    table
      .string('usuario_temporal_password_hash', 255)
      .nullable()
      .comment('Hash de la contraseña del usuario provisorio');
    table
      .timestamp('fecha_creacion', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp('fecha_expiracion', { useTz: true }).nullable();
    table
      .integer('max_accesos')
      .unsigned()
      .nullable()
      .comment('Cantidad máxima de accesos permitidos (null = ilimitado)');
    table.integer('accesos').unsigned().notNullable().defaultTo(0);
    table.boolean('revocado').notNullable().defaultTo(false);
    table.timestamp('fecha_revocado', { useTz: true }).nullable();
    table.timestamp('ultimo_acceso', { useTz: true }).nullable();

    table
      .foreign('registro_id')
      .references('id')
      .inTable('registros_secuestros')
      .onDelete('SET NULL');
    table
      .foreign('usuario_creador_id')
      .references('id')
      .inTable('usuarios')
      .onDelete('SET NULL');

    table.index('token', 'idx_enlaces_compartidos_token');
    table.index('registro_id', 'idx_enlaces_compartidos_registro');
    table.index('usuario_creador_id', 'idx_enlaces_compartidos_usuario');
    table.index('revocado', 'idx_enlaces_compartidos_revocado');
    table.index('fecha_expiracion', 'idx_enlaces_compartidos_expira');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const exists = await knex.schema.hasTable('enlaces_compartidos');
  if (!exists) return;

  await knex.schema.dropTable('enlaces_compartidos');
};
