const { seeder } = require("../dbUtils");

exports.seed = async (knex) => {
  await Promise.all([seeder(knex, "non_queen"), seeder(knex, "movies")]);
};
