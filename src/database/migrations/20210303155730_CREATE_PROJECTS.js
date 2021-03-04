exports.up = function (knex) {
  return knex.schema.createTable('projects', table => {
    table.increments('id').primary()
    table.integer('userId').references('id').inTable('users')
    table.string('name').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('projects')
}
