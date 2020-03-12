import {renderToString} from '@hyperapp/render';

import layout from './app/layout';
import {actions, pages, router, resolve} from './app';

function renderView(view, state) {
  let title = 'HyperApp';

  const body = view({
    title,
    ...state,
    isClient: false,
  }, {
    setTitle: (value) => (title = value),
  });

  return renderToString(layout({
    head: {
      title,
    },
    body,
  }))
}

async function renderApp(url, app = {}) {
  const isJson = url.pathname.endsWith('/page.json')
  let {status, route, component} = resolve(
    '/' + url.pathname.replace(/\/page\.json$/, '').replace(/^\//, ''),
    router,
    pages,
  )

  let page
  if (component.fetchRemoteState) {
    page = await component.fetchRemoteState({url, route}, app)
    status = page ? 200 : 404
  }
  else {
    status = status || 200
  }

  let content
  if (isJson) {
    content = JSON.stringify({page})
  }
  else {
    content = renderView(component.default, {
      url: url.pathname,
      route,
      status,
      page,
    })
  }

  return {page, content}
}

async function main(argv) {
  const config = await import(process.cwd() + '/config.json')
  const url = new URL(argv[2] || '/', `${config.protocol}://${config.host}`)

  const {content} = await renderApp(url)

  console.log(content)
}

main(process.argv)
.catch((error) => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
