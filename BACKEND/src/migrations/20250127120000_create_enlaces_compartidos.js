/**
 * Migración: Crear tablas de enlaces compartidos
 * Nota: Las tablas ya existen en la BD, esta es solo para marcar la migración como ejecutada
 */

exports.up = async function (knex) {
  // Las tablas ya existen, solo retornamos sin hacer nada
  return Promise.resolve();
};

exports.down = async function (knex) {
  // Stub para down
  return Promise.resolve();
};
