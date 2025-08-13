exports.up = function (knex) {
  return knex.schema
    .createTable('convocatorias', function (table) {
      table.increments('id').primary().unsigned();
      table.integer('tipo_id').unsigned().notNullable();
      table.string('nombre_proceso', 300).notNullable();
      table.text('descripcion').nullable();
      table.date('fecha_inicio').notNullable();
      table.date('fecha_fin').nullable();
      table.enu('estado', ['borrador', 'publicada', 'en_proceso', 'finalizada']).defaultTo('borrador');
      table.boolean('activa').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.foreign('tipo_id').references('id').inTable('convocatoria_tipos').onDelete('CASCADE');
    })
    .createTable('convocatoria_archivos', function (table) {
      table.increments('id').primary().unsigned();
      table.integer('convocatoria_id').unsigned().notNullable();
      table.enu('tipo_archivo', [
        'bases', 
        'resultado_curricular', 
        'resultado_entrevista', 
        'resultado_final', 
        'comunicado'
      ]).notNullable();
      table.string('nombre', 300).notNullable();
      table.text('archivo_url').notNullable();
      table.integer('orden').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.foreign('convocatoria_id').references('id').inTable('convocatorias').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('convocatoria_archivos')
    .dropTableIfExists('convocatorias');
};
