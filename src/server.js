import path from 'path'

import Plant from '@plant/plant'
import {createServer} from '@plant/http'
import {serveDir} from '@plant/fs'
import {renderToString} from '@hyperapp/render'

import {handleError} from './lib/plant/error'
import {handleCache} from './lib/plant/cache'
import {handleLogger} from './lib/plant/logger'

import {actions, pages, resolve} from './app'
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
    const isJson = url.pathname.endsWith('/page.json')
    const {route, componentId} = resolve('/' + url.pathname.replace(/\/page\.json$/, '').replace(/^\//, ''))
    const component = pages[componentId]

    let page
    if (component.fetchRemoteState) {
      page = await component.fetchRemoteState({url, route}, app)
    }

    if (isJson) {
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

      res.push('/assets/app.js')
      res.push('/assets/app.css')

      const html = renderView(component.default, {
        url: url.pathname,
        title: 'Paul Rumkin',
        route,
        page,
      })

      res.html(html)
    }
  }
}

function renderView(view, {
  url,
  title = 'Application',
  ...state
}) {
  const tree = layout({
    head: {
      title,
    },
    body: view({
      isClient: false,
      url,
      ...state,
    }, actions()),
    state,
  })

  return renderToString(tree)
}
