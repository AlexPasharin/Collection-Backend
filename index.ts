import * as dotenv from 'dotenv'

import dBConnection from './src/db'
import server from './src/server'

dotenv.config()

const app = server(dBConnection)
const PORT: any = process.env.PORT || 2000

app.listen(PORT, err => {
  if (err) {
    console.log('Could not start the server ', err.stack)
    process.exit(1)
  }
  console.log(`Listening on port ${PORT}`)
})

