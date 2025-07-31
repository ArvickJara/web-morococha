exports.seed = async function (knex) {
  await knex('servicios').del();

  await knex('servicios').insert([
    { municipalidad_id: 1, nombre: 'Licencias de funcionamiento', descripcion: 'Otorgamiento de licencias para establecimientos comerciales', icono: 'fas fa-store', activo: true, orden: 1 },
    { municipalidad_id: 1, nombre: 'Codisec 2025', descripcion: 'Comité Distrital de Seguridad Ciudadana', icono: 'fas fa-shield-alt', activo: true, orden: 2 },
    { municipalidad_id: 1, nombre: 'Participación Vecinal', descripcion: 'Programas de participación ciudadana', icono: 'fas fa-users', activo: true, orden: 3 },
    { municipalidad_id: 1, nombre: 'Administración Tributaria', descripcion: 'Gestión de tributos municipales', icono: 'fas fa-calculator', activo: true, orden: 4 },
    { municipalidad_id: 1, nombre: 'Serenazgo Morococha', descripcion: 'Servicio de seguridad ciudadana', icono: 'fas fa-user-shield', activo: true, orden: 5 },
    { municipalidad_id: 1, nombre: 'Registros Civiles', descripcion: 'Servicios de registro civil', icono: 'fas fa-file-alt', activo: true, orden: 6 },
    { municipalidad_id: 1, nombre: 'Comercialización', descripcion: 'Servicios de comercialización municipal', icono: 'fas fa-shopping-cart', activo: true, orden: 7 }
  ]);
};
