
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'countries'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.string('id').notNullable().unique().primary()
    table.string('name').notNullable().unique()
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

