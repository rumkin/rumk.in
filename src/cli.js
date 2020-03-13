import {Shell} from './lib/Shell'
import {StaticDocument} from './lib/document'

import layout from './app/layout'
import {pages, router} from './app'
import renderStatic from './app/renderStatic'

async function renderApp(shell, app = {}) {
  const {url} = shell
  const isJson = url.pathname.endsWith('/page.json')
  const {route = null, component = pages.errors[404]} = router.resolve(
    '/' + url.pathname.replace(/\/page\.json$/, '').replace(/^\//, ''),
  ) || {}

  let page
  let status = route ? 200 : 404
  if (component.fetchRemoteState) {
    page = await component.fetchRemoteState({url, route, shell}, app)
    status = page ? 200 : 404
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

main(process.argv)
.catch((error) => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
