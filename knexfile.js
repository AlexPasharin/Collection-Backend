const config = {
  client: "pg",
  connection: process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL}`
    : {
        host: "localhost",
        //  database: 'aleksandrpasharin',
        database: "queencollection",
      },
};

module.exports = config;
