// seeds/01_seedAdmin.js

const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Elimina todos los registros
  await knex('usuarios').del();

  // Crea hash de contraseña
  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  // Inserta usuario admin
  await knex('usuarios').insert({
    id: 1,
    role: 'admin',
    nombres: 'Admin',
    primer_apellido: 'User',
    segundo_apellido: '',
    email: 'admin@example.com',
    telefono: '123456789',
    password: hashedPassword,
  });
};
