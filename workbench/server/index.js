import path from 'path'

import Plant from '@plant/plant'
import {createServer} from '@plant/http'
import {serveDir} from '@plant/fs'

import {handleError} from '../../src/lib/plant/error'
import {handleLogger} from '../../src/lib/plant/logger'

async function main({
  argv,
}) {
  const PORT = argv[0] || 8080
  const DIR = argv[1] || '.'

  const plant = new Plant()

  plant.use(async ({res}, next) => {
    await next()
    // Rewrite CSP with empy policy
    res.headers.set('content-security-policy', '')
  })

  // Log requests
  plant.use(handleLogger(console))

  // Handle errors
  plant.use(handleError({
    debug: true,
    logger: console,
  }))

  plant.use(async ({req, res, fetch}, next) => {
    await next()


    if (! res.hasBody) {
      const notFound = await fetch('/_/404')

      if (notFound.status === 200) {
        res.setStatus(404)
        for (const [name, value] of notFound.headers.entries()) {
          res.headers.set(name, value)
        }
        res.body = notFound.body
      }
    }
  })

  // Handle static files
  plant.use(serveDir(DIR))

  const server = createServer(plant)

  server.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`)
  })

  await new Promise((resolve, reject) => {
    server.on('exit', resolve)
    server.on('error', reject)
  })
}

main({
  cmd: process.argv.slice(0, 2),
  argv: process.argv.slice(2),
})
.catch(error => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
