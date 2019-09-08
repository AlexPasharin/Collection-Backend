
const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'entries'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('type').unsigned().notNullable();
    table.string('release_date', 10);
    table.integer('artist_id').unsigned().notNullable();
    table.integer('entry_artist_id').unsigned();

    table.foreign('type').references('id').inTable('types')
    table.foreign('artist_id').references('id').inTable('artists')
    table.foreign('entry_artist_id').references('id').inTable('artists')

    table.unique(['name', 'type', 'artist_id'], 'entry')
  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)

