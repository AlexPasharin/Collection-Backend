import { Express } from 'express'

import { dbConnection } from "../db"

const successHandler = res => data => res.set("Access-Control-Allow-Origin", "*").json(data)

const errorHandler = (res, message: string) => err => {
  console.log(err.stack)
  res.set("Access-Control-Allow-Origin", "*").status(500).send(message)
}

export const setUpRestEndPoints = (app: Express, dBConnection: dbConnection) => {
  app.get('/rest/artists', (_, res) =>
    dBConnection
      .getArtists()
      .then(successHandler(res))
      .catch(errorHandler(res, 'Could not retrieve artists from the database'))
  )

  app.get('/rest/types', (req, res) => {
    const { artist } = req.query

    dBConnection
      .getArtistTypes(Number(artist))
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve artist\'s with id ${artist} entry types from the database`))
  })

  app.get('/rest/entries', (req, res) => {
    const { artist, type } = req.query

    dBConnection.getEntriesByArtistAndType(Number(artist), Number(type))
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve artist\'s ${artist} entries of type ${type} from the database`))
  })

  app.get('/rest/entry', (req, res) => {
    const { id } = req.query

    dBConnection.getEntry(id)
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve entry ${id} from the database`))
  })

  app.get('/rest/releases', (req, res) => {
    const { entry } = req.query

    dBConnection.getReleases(Number(entry))
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve releases of an entry ${entry} from the database`))
  })

  app.get('/rest/release', (req, res) => {
    const { id } = req.query

    dBConnection.getRelease(Number(id))
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve release with id ${id} from the database`))
  })

  app.get('/rest/labels', (_, res) => {
    dBConnection.getLabels()
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve labels from the database`))
  })

  app.get('/rest/formats', (_, res) => {
    dBConnection.getFormats()
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve formats from the database`))
  })

  app.get('/rest/countries', (_, res) => {
    dBConnection.getCountries()
      .then(successHandler(res))
      .catch(errorHandler(res, `Could not retrieve countries from the database`))
  })

  return app
}
