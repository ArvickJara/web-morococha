exports.up = function (knex) {
  return knex.schema.createTable('redes_sociales', function (table) {
    table.increments('id').primary().unsigned();
    table.integer('municipalidad_id').unsigned().notNullable();
    table.string('plataforma', 50).notNullable(); // facebook, twitter, instagram, youtube
    table.string('url', 500).notNullable();
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('municipalidad_id').references('id').inTable('municipalidad').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('redes_sociales');
};
