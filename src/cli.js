import {Shell} from './lib/Shell'
import {StaticDocument} from './lib/document'

import layout from './app/layout'
import router from './app/router'
import renderStatic from './app/renderStatic'

async function renderApp(shell, app = {}) {
  const {url} = shell

  const isJson = url.pathname.endsWith('page.json')
  const jsonPath = isJson ? url.pathname : getJsonPath(url.pathname)
  const pagePath = isJson ? url.pathname.slice(0, -9) : url.pathname.replace(/\/+$/, '')

  const route = router.resolve(pagePath) || null

  const component = route ? route.value : router.resolve('/_/404')
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

  let content
  if (isJson) {
    content = JSON.stringify({page})
  }
  else {
    content = renderStatic(component.default, {
      shell,
      url: shell.url,
      route,
      status,
      isLoading: false,
      page,
    })
  }

  return content
}

async function main(argv) {
  const config = await import(process.cwd() + '/config.json')
  const url = new URL(argv[2] || '/', `${config.protocol}://${config.host}`)

  const shell = new Shell({
    doc: new StaticDocument,
    url,
    isStatic: true,
    hasViewport: false,
  })

  const content = await renderApp(shell)

  console.log(content)
}

function getJsonPath(pathname) {
  return `${pathname.replace(/\/+$/, '')}/page.json`
}

main(process.argv)
.catch((error) => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
