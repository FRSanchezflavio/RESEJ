const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Verificar si ya existe el usuario admin
  const existingAdmin = await knex('usuarios')
    .where({ usuario: 'admin' })
    .first();

  if (existingAdmin) {
    console.log('⚠️  Usuario admin ya existe, omitiendo seed...');
    return;
  }

  // Hashear contraseña
  const passwordHash = await bcrypt.hash('Admin2025!', 12);

  // Insertar usuario administrador por defecto
  await knex('usuarios').insert([
    {
      usuario: 'admin',
      password_hash: passwordHash,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'administrador',
      activo: true,
      fecha_creacion: new Date(),
      creado_por: null,
    },
  ]);

  console.log('✓ Usuario administrador creado exitosamente');
  console.log('  Usuario: admin');
  console.log('  Contraseña: Admin2025!');
  console.log('  ⚠️  IMPORTANTE: Cambiar la contraseña en el primer acceso');
};
