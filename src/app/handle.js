import {renderToString} from '@hyperapp/render'
import Plant from '@plant/plant'

import {Shell} from '../lib/Shell'
import {StaticDocument} from '../lib/Document'

import actions from './actions'
import layout from './layout'

export default function handleApp({
  app,
  router,
}) {
  return async ({req, res}) => {
    try {
      await respond({
        res,
        app,
        router,
      })
    }
    catch (error) {
      console.error(error)
      const route = router.resolve('/_/500')
      writeResponse({
        res,
        route,
        globals: app.config.globals,
        status: 500,
        error,
      })
    }
  }
}

async function respond({
  res,
  app,
  router,
}) {
  const {url} = res
  const {route, status, page} = await loadPage(
    url,
    router,
    app,
  )

  if (url.pathname.endsWith('/page.json')) {
    res.setStatus(status)
    res.json({page})
  }
  else {
    writeResponse({
      res,
      route,
      globals: app.config.globals,
      status,
      page,
    })
  }
}

function writeResponse({
  res,
  route,
  status,
  globals = {},
  page = null,
  error = null
}) {
  const {url} = res

  const shell = new Shell({
    doc: new StaticDocument,
    url,
    isStatic: true,
    hasViewport: false,
  })

  const html = renderStatic(route.value.default, {
    shell,
    url: url.href.slice(url.origin.length),
    route,
    status,
    isLoading: false,
    page,
    error,
    globals,
  })

  res.push(
    new Plant.Response({
      url: new URL(
        getJsonPath(url.pathname),
        url,
      ),
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({page}),
    })
  )

  // TODO replace with shell.doc.styles and shell.doc.scripts
  res.push('/assets/app.js')
  res.push('/assets/app.css')

  res.setStatus(status)
  res.html(html)
}

async function loadPage(url, router, app) {
  const route = router.resolve(
    normalizePathname(url.pathname)
  )

  if (! route) {
    return {
      route: router.resolve('/_/404'),
      status: 404,
      page: null,
    }
  }

  const component = route.value

  let page = {}
  if (component.fetchRemoteState) {
    page = await component.fetchRemoteState({url, route}, app.services, app)
  }

  if (! page) {
    return {
      route: router.resolve('/_/404'),
      status: 404,
      page: null,
    }
  }

  return {
    route,
    status: 200,
    page,
  }
}

function normalizePathname(pathname) {
  if (pathname.endsWith('/page.json')) {
    return '/' + pathname.slice(0, -10).replace(/^\/+/, '')
  }
  else {
    return '/' + pathname.replace(/^\/+/, '').replace(/\/+$/, '')
  }
}

function getJsonPath(pathname) {
  return `${pathname.replace(/\/+$/, '')}/page.json`
}

function renderStatic(view, state) {
  const {shell} = state
  const output = view(state, actions({
    shell,
  }))

  return renderToString(layout({
    doc: shell.doc,
    output,
    state,
  }))
}
