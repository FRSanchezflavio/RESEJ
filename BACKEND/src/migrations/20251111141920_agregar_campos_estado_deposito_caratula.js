/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Verificar qué columnas ya existen
  const columnas = [
    'estado_secuestro',
    'lugar_deposito',
    'caratula',
    'victima',
    'imputado_causante',
    'denunciante',
  ];

  const columnasExistentes = [];
  for (const columna of columnas) {
    const existe = await knex.schema.hasColumn('registros_secuestros', columna);
    if (existe) {
      columnasExistentes.push(columna);
    }
  }

  if (columnasExistentes.length === columnas.length) {
    console.log('⚠️  Todas las columnas ya existen, omitiendo migración...');
    return;
  }

  return knex.schema.table('registros_secuestros', function (table) {
    // Solo agregar columnas que no existen
    if (!columnasExistentes.includes('estado_secuestro')) {
      table
        .string('estado_secuestro', 100)
        .comment(
          'Estado del secuestro (ej: en depósito, devuelto, destruido, etc.)'
        );
    }
    if (!columnasExistentes.includes('lugar_deposito')) {
      table
        .string('lugar_deposito', 200)
        .comment('Lugar donde se encuentra depositado el secuestro');
    }
    if (!columnasExistentes.includes('caratula')) {
      table.text('caratula').comment('Carátula de la causa judicial');
    }
    if (!columnasExistentes.includes('victima')) {
      table.string('victima', 200).comment('Nombre de la víctima');
    }
    if (!columnasExistentes.includes('imputado_causante')) {
      table
        .string('imputado_causante', 200)
        .comment('Nombre del imputado o causante');
    }
    if (!columnasExistentes.includes('denunciante')) {
      table.string('denunciante', 200).comment('Nombre del denunciante');
    }
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
