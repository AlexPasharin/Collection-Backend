const { seeder } = require('../dbUtils')

exports.seed = async knex => {
  await seeder(knex, 'non_queen')
}

