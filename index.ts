import dBConnection from './src/db'
import server from './src/server'

const app = server(dBConnection)
const PORT = 2000

app.listen(PORT, err => {
  if (err) {
    console.log('Could not start the server ', err.stack)
    process.exit(1)
  }
  console.log(`Listening on port ${PORT}`)
})

