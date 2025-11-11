/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('registros_secuestros', function (table) {
    // Nuevos campos solicitados
    table
      .string('estado_secuestro', 100)
      .comment(
        'Estado del secuestro (ej: en depósito, devuelto, destruido, etc.)'
      );
    table
      .string('lugar_deposito', 200)
      .comment('Lugar donde se encuentra depositado el secuestro');

    // Campos de carátula judicial (editables solo por administradores en búsqueda)
    table.text('caratula').comment('Carátula de la causa judicial');
    table.string('victima', 200).comment('Nombre de la víctima');
    table
      .string('imputado_causante', 200)
      .comment('Nombre del imputado o causante');
    table.string('denunciante', 200).comment('Nombre del denunciante');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('registros_secuestros', function (table) {
    table.dropColumn('estado_secuestro');
    table.dropColumn('lugar_deposito');
    table.dropColumn('caratula');
    table.dropColumn('victima');
    table.dropColumn('imputado_causante');
    table.dropColumn('denunciante');
  });
};
