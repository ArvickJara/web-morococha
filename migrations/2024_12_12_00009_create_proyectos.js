exports.up = function (knex) {
  return knex.schema.createTable('proyectos', function (table) {
    table.increments('id').primary().unsigned();
    table.string('titulo', 200).notNullable();
    table.text('descripcion').nullable();
    table.string('ubicacion', 150).nullable();
    table.date('fecha_inicio').nullable();
    table.date('fecha_fin').nullable();
    table.decimal('presupuesto', 14, 2).nullable();
    table.enu('estado', ['planificacion', 'ejecucion', 'finalizada']).defaultTo('planificacion');
    table.text('imagen_url').nullable();
    table.boolean('activa').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('proyectos');
};
