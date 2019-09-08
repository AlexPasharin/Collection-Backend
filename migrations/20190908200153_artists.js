
const { createIfDoesntExist } = require('../dbUtils')

exports.up = knex =>
  createIfDoesntExist(knex, 'artists', table => {
    table.increments('id').primary()
    table.string('name').notNullable().unique()
  })

exports.down = knex =>
  knex.schema.dropTableIfExists('artists')
