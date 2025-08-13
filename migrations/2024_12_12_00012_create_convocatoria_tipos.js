exports.up = function (knex) {
  return knex.schema.createTable('convocatoria_tipos', function (table) {
    table.increments('id').primary().unsigned();
    table.string('nombre', 200).notNullable();
    table.text('descripcion').nullable();
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('convocatoria_tipos');
};
