import * as knex from 'knex'

export class dbConnection {
  dbInstance = knex({
    client: 'mysql',
    connection: {
      user: 'root',
      database: 'QueenCollection'
    }
  })

  checkHealth = () => {
    this.dbInstance.raw('select 1+1 as result')
      .then(() => console.log("Successfully established connection"))
      .catch(() => {
        console.log("Could not establish db connection\n");
        process.exit(1);
      });
  }

  getArtists = () => this.dbInstance('Artist').select()

  getArtistTypes = (artistID: number) => this.dbInstance
    .distinct('t.id', 't.name')
    .select()
    .from('type as t')
    .leftJoin(
      'Discography_entry as e',
      'e.type',
      't.id',
    )
    .where('artist_id', artistID)
    .orWhere('entry_artist_id', artistID)

  getEntriesByArtistAndType = (artistID: number, typeID: number) =>
    this.dbInstance
      .select()
      .from('Discography_entry')
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
      .from('Release')
      .where({
        entry_id: entry
      })

  getRelease = (id: Number) =>
    this.dbInstance
      .table('Release')
      .first()
      .where({
        id
      })

  getEntry = (id: Number) =>
    this.dbInstance
      .table('Discography_entry')
      .first()
      .where({
        id
      })

  getLabels = () =>
    this.dbInstance('Label')
      .select()

  getFormats = () =>
    this.dbInstance('Format')
      .select()

  getCountries = () =>
    this.dbInstance('Country')
      .select()

  addRelease = release =>
    this.dbInstance('Release')
      .returning('id')
      .insert(release)
      .then(([release_id]) => ({ release_id }))

  updateRelease = release =>
    this.dbInstance('Release')
      .where({ id: release.id })
      .update(release)
      .then(() => this.getRelease(release.id))

  getReleaseTracks = release_id =>
    this.dbInstance('Composition as c')
      .join(
        'Track as t',
        'c.id',
        't.composition_id',
      )
      .join(
        'Release_track as rt',
        'rt.track_id',
        't.id'
      )
      .select(['name', 't.id', 'composition_id', 'alt_name', 'version', 'performer_id', 'release_id', 'track_id', 'number', 'subversion', 'comment', 'length', 'place'])
      .where({ release_id })

  getCompositions = () =>
    this.dbInstance('Composition').select()
}

const connection = new dbConnection

connection.checkHealth();

export default connection
