import {app as createApp} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {Shell} from './lib/Shell'
import {DynamicDocument} from './lib/document'

import {actions, getJson, pages, router} from './app'

const history = createBrowserHistory()

const root = document.getElementById('app')
const shell = new Shell({
  url: new URL(window.location),
  doc: new DynamicDocument(document),
  hasViewport: true,
  isStatic: false,
})

const state = Object.assign({
  route: null,
  isLoading: null,
  status: 0,
  error: null,
  page: null,
}, getJson('/state.json'))

// TODO Remove history
const app = createApp(state, actions({shell, history}), view, root)

history.listen((location) => {
  const to = new URL(location.pathname + location.search + location.hash, shell.url)
  const from = shell.url

  shell.navigate(to)
  app.pageNavigated(to, from)
})

function view(state, actions) {
  const {pathname} = shell.url
  const {
    route = null,
    component = pages.errors[404],
  } = router.resolve(pathname) || {}

  let status = route ? 200 : 404
  if (component.fetchRemoteState) {
    status = 0
  }

  return component.default({
    shell,
    url: shell.url,
    status,
    route,
    ...state,
  }, actions)
}
