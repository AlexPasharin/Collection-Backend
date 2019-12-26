
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'non_queen'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.increments('id').primary();
    table.string('artist_name').notNullable();
    table.string('name').notNullable();
    table.string('format').notNullable();
    table.text('comment');
    table.text('discogs_url');
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

