import {app} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {actions, getJson, resolve, router, pages} from './app'

const history = createBrowserHistory()

const state = Object.assign({}, getJson('/state.json'), {
  isClient: true,
  url: String(location.pathname),
})

function view (state, actions) {
  const {url} = state
  let {status, route, component} = resolve(
    '/' + url.replace(/\/page\.json$/, '').replace(/^\//, ''),
    router,
    pages,
  )

  return component.default({
    status,
    ...state,
    route,
  }, actions)
}

const root = document.getElementById('app');
const main = app(state, actions({history}), view, root)

history.listen((location) => {
  const path = location.pathname + location.search
  main.pageSet(path)
})
