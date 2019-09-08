
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'types'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.increments('id').primary()
    table.string('name').notNullable().unique()
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

