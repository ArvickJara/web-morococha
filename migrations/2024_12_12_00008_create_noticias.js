exports.up = function (knex) {
  return knex.schema.createTable('noticias', function (table) {
    table.increments('id').primary().unsigned();
    table.string('titulo', 300).notNullable();
    table.text('resumen').nullable();
    table.longtext('contenido').nullable();
    table.string('imagen_url', 500).nullable();
    table.string('autor', 100).nullable();
    table.boolean('destacada').defaultTo(false);
    table.boolean('activa').defaultTo(true);
    table.datetime('fecha_publicacion').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('noticias');
};
