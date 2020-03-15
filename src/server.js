import path from 'path'

import Plant from '@plant/plant'
import {createServer} from '@plant/http'
import {serveDir} from '@plant/fs'

import {handleError} from './lib/plant/error'
import {handleCache} from './lib/plant/cache'
import {handleLogger} from './lib/plant/logger'
import {Shell} from './lib/Shell'
import {StaticDocument} from './lib/document'

import {actions, pages, router} from './app'
import renderStatic from './app/renderStatic'
import layout from './app/layout'

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
plant.use(handleApp())

const server = createServer(plant)

server.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`)
})

function handleApp(app = {}) {
  return async ({req, res, socket}) => {
    const {url} = req
    const shell = new Shell({
      doc: new StaticDocument,
      url,
      isStatic: true,
      hasViewport: false,
    })

    const isJson = url.pathname.endsWith('/page.json')
    const route = router.resolve(
      '/' + url.pathname.replace(/\/page\.json$/, '').replace(/^\//, ''),
    ) || null

    const component = route ? route.value : router.resolve('/_/404').value
    const isFound = !! route

    let status
    let page = {}
    if (component.fetchRemoteState) {
      page = await component.fetchRemoteState({url, route}, app)
      if (isFound) {
        status = page ? 200 : 404
      }
      else {
        status = 404
      }
    }
    else {
      status = isFound ? 200 : 404
    }

    if (isJson) {
      res.setStatus(status)
      res.json({page})
    }
    else {
      res.push(
        new Plant.Response({
          url: new URL(`${url.pathname}/page.json`, req.url),
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({page}),
        })
      )

      // TODO replace with shell.doc.styles and shell.doc.scripts
      res.push('/assets/app.js')
      res.push('/assets/app.css')

      const html = renderStatic(component.default, {
        shell,
        url: shell.url,
        route,
        status,
        isLoading: false,
        page,
      })

      res.setStatus(status)
      res.html(html)
    }
  }
}
