const { seeder } = require('../dbUtils')

exports.seed = async knex => {
  await Promise.all([
    seeder(knex, 'artists'),
    seeder(knex, 'types'),
    seeder(knex, 'formats'),
    seeder(knex, 'labels'),
    seeder(knex, 'countries')
  ])

  await seeder(knex, 'entries')
  await seeder(knex, 'releases')
}

