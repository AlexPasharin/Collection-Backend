import * as knex from 'knex'

const psConfig = ({
  client: 'pg',
  connection: process.env.DATABASE_URL ? process.env.DATABASE_URL : {
    host: 'localhost',
    database: 'queencollection'
  }
})

// const msqlConnection = {
//   client: 'mysql',
//   connection: {
//     user: 'root',
//     database: 'QueenCollection'
//   }
// }

export class dbConnection {
  dbInstance: any;

  constructor() {
    this.dbInstance = knex(psConfig)

    this.checkHealth()
  }


  checkHealth = () => {
    this.dbInstance.raw('select 1+1 as result')
      .then(() => console.log("Successfully established connection"))
      .catch(() => {
        console.log("Could not establish db connection\n");
        process.exit(1);
      });
  }

  getArtists = () => this.dbInstance('artists').select()

  getArtistTypes = (artistID: number) => this.dbInstance
    .distinct('t.id', 't.name')
    .select()
    .from('types as t')
    .leftJoin(
      'entries as e',
      'e.type',
      't.id',
    )
    .where('artist_id', artistID)
    .orWhere('entry_artist_id', artistID)

  getEntriesByArtistAndType = (artistID: number, typeID: number) =>
    this.dbInstance
      .select()
      .from('entries')
      .where({
        artist_id: artistID,
        type: typeID,
      })
      .orWhere({
        entry_artist_id: artistID,
        type: typeID,
      })

  getReleases = (entry: number) =>
    this.dbInstance
      .select()
      .from('releases')
      .where({
        entry_id: entry
      })

  getRelease = (id: Number) =>
    this.dbInstance
      .table('releases')
      .first()
      .where({
        id
      })

  getEntry = (id: Number) =>
    this.dbInstance
      .table('entries')
      .first()
      .where({
        id
      })

  getLabels = () =>
    this.dbInstance('labels')
      .select()

  getFormats = () =>
    this.dbInstance('formats')
      .select()

  getCountries = () =>
    this.dbInstance('countries')
      .select()
}

export default (new dbConnection)
