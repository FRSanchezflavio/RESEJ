/**
 * Migración: Agregar campo observaciones a registros_secuestros (si no existe)
 */
exports.up = async function(knex) {
  // Verificar si la columna ya existe
  const hasColumn = await knex.schema.hasColumn('registros_secuestros', 'observaciones');
  
  if (!hasColumn) {
    return knex.schema.table('registros_secuestros', function(table) {
      table.text('observaciones').nullable();
    });
  }
};

exports.down = function(knex) {
  return knex.schema.table('registros_secuestros', function(table) {
    table.dropColumn('observaciones');
  });
};
