exports.up = function (knex) {
  return knex.schema.createTable('servicios', function (table) {
    table.increments('id').primary().unsigned();
    table.integer('municipalidad_id').unsigned().notNullable();
    table.string('nombre', 200).notNullable();
    table.text('descripcion').nullable();
    table.string('icono', 100).nullable(); // para íconos CSS
    table.boolean('activo').defaultTo(true);
    table.integer('orden').defaultTo(0); // para ordenar los servicios
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('municipalidad_id').references('id').inTable('municipalidad').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('servicios');
};
