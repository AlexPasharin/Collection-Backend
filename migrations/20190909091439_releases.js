const { createIfDoesntExist } = require('../dbUtils')

const tableName = 'releases'

exports.up = knex =>
  createIfDoesntExist(knex, tableName, table => {
    table.increments('id').primary();
    table.integer('entry_id').unsigned().notNullable();
    table.string('name');
    table.string('format');
    table.string('release_date', 10).default(null);
    table.string('version').notNullable()
    table.string('country').default(null)
    table.string('label').default(null)
    table.string('cat_number');
    table.text('comment');
    table.text('discogs_url');
    table.text('condition_problems')

    table.foreign('entry_id').references('id').inTable('entries')
    table.foreign('format').references('id').inTable('formats')
    table.foreign('country').references('id').inTable('countries')
    table.foreign('label').references('name').inTable('labels')

    table.unique(['entry_id', 'version', 'comment'], 'release')

  })

exports.down = knex =>
  knex.schema.dropTableIfExists(tableName)
