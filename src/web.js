import {app as createApp} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {Shell} from './lib/Shell'
import {DynamicDocument} from './lib/document'
import fooid from './lib/fooid'

import actions from './app/actions'
import router from './app/router'
import {getJson} from './app/store'

const history = createBrowserHistory()

const root = document.getElementById('app')
const shell = new Shell({
  url: new URL(window.location),
  doc: new DynamicDocument(document),
  hasViewport: true,
  isStatic: false,
})

if (! history.location.state) {
  history.replace(location.href.slice(location.origin.length), {
    stateId: fooid(),
    height: history.length,
  })
}

const state = Object.assign({
  stateId: history.location.state.stateId,
  route: null,
  isLoading: null,
  status: 0,
  error: null,
  page: null,
}, getJson('/state.json'))

const cache = new Map()
const heights = new Map()
cache.set(history.location.state.stateId, state)
heights.set(history.length, history.location.state.stateId)

// TODO Remove history
const app = createApp(state, actions({shell, history, cache, heights}), view, root)

history.listen((location, action) => {
  const to = new URL(location.pathname + location.search + location.hash, shell.url)
  const from = shell.url

  shell.navigate(to)
  app.pageNavigated({to, from, ...location.state})
})

function view(state, actions) {
  const {pathname} = shell.url
  const route = router.resolve(pathname) || null

  const component = route ? route.value : router.resolve('/_/404').value
  const isFound = !! route
  let status
  if (component.fetchRemoteState) {
    status = isFound ? 0 : 404
  }
  else {
    status = isFound ? 200 : 404
  }

  return component.default({
    shell,
    url: shell.url,
    route,
    status,
    route,
    ...state,
  }, actions)
}
