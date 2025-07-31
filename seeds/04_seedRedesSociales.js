exports.seed = async function (knex) {
  await knex('redes_sociales').del();

  await knex('redes_sociales').insert([
    { municipalidad_id: 1, plataforma: 'facebook', url: 'https://facebook.com/munimorococha', activo: true },
    { municipalidad_id: 1, plataforma: 'twitter', url: 'https://twitter.com/munimorococha', activo: true },
    { municipalidad_id: 1, plataforma: 'instagram', url: 'https://instagram.com/munimorococha', activo: true },
    { municipalidad_id: 1, plataforma: 'youtube', url: 'https://youtube.com/munimorococha', activo: true }
  ]);
};
