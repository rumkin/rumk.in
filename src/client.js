import {app as createApp} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {Shell} from './lib/Shell'
import {DynamicDocument} from './lib/Document'
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
  history.replace(
    addUrlTrailingSlash(location.href.slice(location.origin.length)),
    {
      stateId: fooid(),
      height: history.length,
    },
  )
}

const state = Object.assign({
  stateId: history.location.state.stateId,
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
  try {
    if (state.status === 404) {
      return render404(state, actions)
    }
    else if (state.status === 500) {
      return render500(state, actions)
    }

    return renderPage(state, actions)
  }
  catch (error) {
    console.error(error)
    return render500({
      state,
      ...error,
    }, actions)
  }
}

function renderPage(state, actions) {
  const {url} = shell
  const {route, status} = resolve(url.pathname, router)

  return route.value.default({
    shell,
    url,
    route,
    status,
    ...state,
  }, actions)
}

function render404(state, actions) {
  return renderError(404, state, actions)
}

function render500(state, actions) {
  return renderError(500, state, actions)
}

function renderError(status, state, actions) {
  const route = router.resolve(`/_/${status}`)
  return route.value.default({
    shell,
    url: shell.url,
    route,
    ...state,
  }, actions)
}

function resolve(pathname, router) {
  const route = router.resolve(pathname)

  if (! route) {
    return {
      route: router.resolve('/_/404'),
      status: 404,
    }
  }
  else {
    return {
      route,
      status: route.value.fetchRemoteState ? 0 : 200
    }
  }
}

function addUrlTrailingSlash(url) {
  if (/\/[^.\/]+$/.test(url)) {
    return `${url}/`
  }
  else {
    return url
  }
}
