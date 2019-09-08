const { seeder } = require('../dbUtils')

exports.seed = async knex => {
  await Promise.all([
    seeder(knex, 'artists'),
    seeder(knex, 'types')
  ])

  await seeder(knex, 'entries')
}

