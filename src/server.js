import path from 'path'

import Plant from '@plant/plant'
import {createServer} from '@plant/http'
import {serveDir} from '@plant/fs'

import {handleError} from './lib/plant/error'
import {handleCache} from './lib/plant/cache'
import {handleLogger} from './lib/plant/logger'

import App from './lib/app'
import handleApp from './app/handle'
import router from './app/router'
import {initServices} from './lib/services'

async function main() {
  const config = await import(
    path.join(process.cwd(), '/config.json')
  )

  const app = new App({config})

  initServices(
    app,
    path.join(__dirname, '/app/services/'),
    config.services,
  )

  const PORT = process.argv[2] || 8080

  const plant = new Plant()

  // Log requests
  plant.use(handleLogger(console))

  // Handle errors
  plant.use(handleError({
    debug: true,
    logger: console,
  }))

  // Handle static files
  plant.use('/assets/*', serveDir(
    path.join(__dirname, 'assets')
  ))

  // Cache app rendering result
  plant.use(handleCache())
  // Serve app requests
  plant.use(handleApp({
    app,
    router,
  }))

  const server = createServer(plant)

  server.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`)
  })

  await new Promise((resolve, reject) => {
    server.on('exit', resolve)
    server.on('error', reject)
  })
}

main()
.catch(error => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
