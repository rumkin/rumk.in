import Plant from '@plant/plant'

import {Shell} from '../lib/Shell'
import {StaticDocument} from '../lib/document'

import renderStatic from './renderStatic'
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
      status,
      page,
    })
  }
}

function writeResponse({
  res,
  route,
  status,
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
    url: shell.url,
    route,
    status,
    isLoading: false,
    page,
    error,
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

  let page
  if (component.fetchRemoteState) {
    page = await component.fetchRemoteState({url, route}, app)
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
