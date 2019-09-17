
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'formats'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.string('id').notNullable().unique().primary()
    table.string('description').notNullable()
    table.boolean('hasSides').default(false)
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

