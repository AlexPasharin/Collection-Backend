import * as express from 'express'
import { setUpRestEndPoints } from './server/restEndpoints';

const server = dBConnection => {
  let app = express()

  app.use('/assets', express.static('assets'))
  app.use(express.json()) // for parsing application/json

  app = setUpRestEndPoints(app, dBConnection)

  return app
}

export default server
