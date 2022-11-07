const parse = require("pg-connection-string").parse;

const config = {
  client: "pg",
  connection: process.env.DATABASE_URL
    ? getConnection()
    : {
        host: "localhost",
        //  database: 'aleksandrpasharin',
        database: "queencollection",
      },
};

module.exports = config;

function getConnection() {
  const connection = parse(`${process.env.DATABASE_URL}?ssl=true`);

  connection.ssl = { rejectUnauthorized: false };

  return connection;
}
