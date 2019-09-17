
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'labels'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.string('name').notNullable().unique().primary()
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

