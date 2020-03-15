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
    const {url} = req
    const shell = new Shell({
      doc: new StaticDocument,
      url,
      isStatic: true,
      hasViewport: false,
    })

    const isJson = url.pathname.endsWith('page.json')
    const jsonPath = isJson ? url.pathname : getJsonPath(url.pathname)
    const pagePath = isJson ? url.pathname.slice(0, -9) : url.pathname.replace(/\/+$/, '')

    const route = router.resolve(pagePath) || null

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
          url: new URL(`${pagePath}/page.json`, req.url),
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

function getJsonPath(pathname) {
  return `${pathname.replace(/\/+$/, '')}/page.json`
}
