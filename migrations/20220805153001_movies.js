const { createIfDoesntExist } = require("../dbUtils");

const tableName = "movies";

exports.up = (knex) =>
  createIfDoesntExist(knex, tableName, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("format").notNullable();
    table.text("comment");
    table.text("imdb_url");
  });

exports.down = (knex) => knex.schema.dropTableIfExists(tableName);
