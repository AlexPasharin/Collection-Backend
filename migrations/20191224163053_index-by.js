const tableName = 'non_queen'

exports.up = knex =>
  knex.schema.table(tableName, table => {
    table.string('index_by');
  })

exports.down = knex =>
  knex.schema.table(tableName, table => {
    table.dropColumn('index_by')
  })

