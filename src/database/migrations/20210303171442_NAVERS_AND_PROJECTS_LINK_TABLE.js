exports.up = function (knex) {
  return knex.schema.createTable('navers_projects', table => {
    table.increments('id').primary()
    table
      .integer('naverId')
      .references('id')
      .inTable('navers')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .integer('projectId')
      .references('id')
      .inTable('projects')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('navers_projects')
}
