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
    //    delimiter: "\t",
    checkType: true,
    nullObject: true
  })
    .fromFile(`./csv/${tableName}.csv`)
    .then(data => {
      //      knex(tableName).del()
      knex(tableName).insert(data)
    })
    .then(() => console.log(`Table ${tableName} seeded`))
    .catch(err => {
      console.log(`Could not seed for ${tableName}`)
      console.log("Error: ", err)
      console.log()

      return null
    })

module.exports = {
  seeder,
  createIfDoesntExist
}

