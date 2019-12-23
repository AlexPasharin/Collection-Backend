import * as knex from 'knex'
import * as path from 'path'
const psConfig = require("../knexfile.js")

psConfig.connection.database = 'queencollection'

// const msqlConnection = {
//   client: 'mysql',
//   connection: {
//     user: 'root',
//     database: 'QueenCollection'
//   }
// }

export type dbQueryFunc = () => Promise<any>

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

  insert: (data: any, tableName: string) => Promise<any[]> =
    async (data, tableName) => {
      const next_id = data.id ?
        data.id : (await this.dbInstance(tableName).max('id'))[0].max + 1

      return this.dbInstance(tableName)
        .returning('id')
        .insert({
          id: next_id,
          ...data
        })
    }

  getArtists: () => dbQueryFunc =
    () => () => this.dbInstance('artists').select()

  getArtistTypes: (artistID: number) => dbQueryFunc =
    artistID => () => this.dbInstance
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

  getEntriesByArtistAndType: (artistID: number, typeID: number) => dbQueryFunc =
    (artistID, typeID) => () =>
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

  getReleases: (entry: number) => dbQueryFunc =
    entry => () =>
      this.dbInstance
        .select()
        .from('releases')
        .where({
          entry_id: entry
        })

  getRelease: (id: Number) => dbQueryFunc =
    id => () =>
      this.dbInstance
        .table('releases')
        .first()
        .where({
          id
        })

  getEntry: (id: Number) => dbQueryFunc =
    id => () =>
      this.dbInstance
        .table('entries')
        .first()
        .where({
          id
        })

  getLabels: () => dbQueryFunc =
    () => () => this.dbInstance('labels').select()

  getFormats: () => dbQueryFunc =
    () => () => this.dbInstance('formats').select()

  getCountries: () => dbQueryFunc =
    () => () => this.dbInstance('countries').select()

  addRelease: (release: any) => () => Promise<({ release_id: Number })> =
    release => () =>
      this.insert(release, 'releases')
        .then(([release_id]) => ({ release_id }))

  updateRelease: (release: any) => dbQueryFunc =
    release => () =>
      this.dbInstance('releases')
        .where({ id: release.id })
        .update(release)
        .then(this.getRelease(release.id))

  getReleaseTracks: (release_id: any) => dbQueryFunc =
    release_id => () =>
      this.dbInstance('compositions as c')
        .join(
          'tracks as t',
          'c.id',
          't.composition_id',
        )
        .join(
          'release_tracks as rt',
          'rt.track_id',
          't.id'
        )
        .select(['name', 't.id', 'composition_id', 'alt_name', 'version', 'performer_id', 'release_id', 'track_id', 'number', 'subversion', 'comment', 'length', 'place'])
        .where({ release_id })

  getCompositions: () => dbQueryFunc =
    () => () => this.dbInstance('compositions').select()

  dumb = tableName => {
    const rootDir = path.dirname(process.mainModule.filename)
    console.log(rootDir)
    return this.dbInstance.raw(`\copy (select * from ${tableName}) to '${rootDir}/csv/${tableName}.csv' With CSV HEADER NULL 'null';`)
  }
}

export default (new dbConnection)
