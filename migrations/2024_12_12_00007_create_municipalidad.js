exports.up = function (knex) {
  return knex.schema.createTable('municipalidad', function (table) {
    table.increments('id').primary().unsigned();
    table.string('nombre', 200).notNullable();
    table.string('slogan', 300).nullable();
    table.text('direccion').nullable();
    table.string('telefono', 20).nullable();
    table.string('email', 255).nullable();
    table.string('horarios_atencion', 200).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('municipalidad');
};