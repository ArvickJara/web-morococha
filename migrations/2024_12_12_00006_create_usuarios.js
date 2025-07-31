// migrations/xxxx_create_usuarios_table.js

exports.up = function (knex) {
  return knex.schema.createTable('usuarios', function (table) {
    table.increments('id').primary().unsigned();
    table.string('role', 50).notNullable().defaultTo('conductor');
    table.string('nombres', 100).nullable();
    table.string('primer_apellido', 100).nullable();
    table.string('segundo_apellido', 100).nullable();
    table.string('dni', 8).nullable();
    table.string('email', 255).nullable().unique();
    table.string('telefono', 15).nullable();
    table.string('password', 255).notNullable(); 
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('usuarios');
};
