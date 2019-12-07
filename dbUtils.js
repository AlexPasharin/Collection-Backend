const csv = require('csvtojson')

const createIfDoesntExist = (knex, tableName, cb) =>
  knex.schema.hasTable(tableName).then(exists => {
    if (exists) {
      console.log(`Table ${tableName} already exists`)
      return null
    }

    return knex.schema.createTable(tableName, cb)
      .then(() => console.log(`Table ${tableName} created`))

  }).catch(err => {
    console.log(`Error creating table ${tableName}: `)
    console.log(err)
  })

const seeder = (knex, tableName) =>
  csv({
    delimiter: "\t",
    checkType: true,
    nullObject: true
  })
    .fromFile(`./csv/${tableName}.tsv`)
    .then(data => knex(tableName).insert(data))
    .then(() => console.log(`Table ${tableName} seeded`))
    .catch(err => {
      console.log(`Could not seed for ${tableName}`)
      console.log("Error: ", err)
      console.log()

      return null
    })

const dumb = (knex, tableName) =>
  knex.raw(`\copy (select * from entries) to '/Users/aleksandrpasharin/materials/queen-collection-2/dumb/${tableName}.csv' With CSV HEADER QUOTE '''' FORCE QUOTE *;`)

module.exports = {
  seeder,
  createIfDoesntExist,
  dumb
}

