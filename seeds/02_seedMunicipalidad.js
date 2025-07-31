exports.seed = async function (knex) {
  await knex('municipalidad').del();

  await knex('municipalidad').insert({
    id: 1,
    nombre: 'Municipalidad Distrital de Morococha',
    slogan: 'Trabajando juntos por el desarrollo de Morococha',
    direccion: 'Plaza Principal S/N, Morococha, Yauli, Junín',
    telefono: '064-123456',
    email: 'contacto@munimorococha.gob.pe',
    horarios_atencion: 'Lunes a Viernes 8:00 - 17:00'
  });
};