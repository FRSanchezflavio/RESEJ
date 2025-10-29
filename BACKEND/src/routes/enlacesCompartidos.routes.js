const express = require('express');
const router = express.Router();
const {
  create,
  list,
  getByToken,
  revoke,
  accessPublico,
} = require('../controllers/enlacesCompartidosController');
const { authenticateToken } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');

// Rutas públicas (sin autenticación)
// ⚠️ ORDEN IMPORTANTE: Esta debe ir antes de las rutas con :token
router.get('/publico/:token', createLimiter, accessPublico);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, createLimiter, create);
router.get('/', authenticateToken, list);
router.get('/:token', authenticateToken, getByToken);
router.post('/:token/revocar', authenticateToken, revoke);

module.exports = router;

exports.up = function (knex) {
  return knex.schema.createTable('enlaces_compartidos', table => {
    table.increments('id').primary();
    table.string('token', 64).notNullable().unique();

    // 🔹 CAMBIO: debe ser usuario_creador_id, no usuario_id
    table
      .integer('usuario_creador_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE');

    table
      .integer('registro_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('registros_secuestros')
      .onDelete('CASCADE');

    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
    table.timestamp('fecha_expiracion').notNullable();
    table.boolean('revocado').defaultTo(false);
    table.timestamp('fecha_revocacion');
    table.integer('max_accesos').unsigned();
    table.integer('accesos_realizados').defaultTo(0);

    table.index(['token']);
    table.index(['usuario_creador_id']);
    table.index(['registro_id']);
    table.index(['fecha_expiracion']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('enlaces_compartidos');
};
