import {app} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {actions, getJson, pages, router} from './app'

const history = createBrowserHistory()

const state = Object.assign({}, getJson('/state.json'), {
  isClient: true,
  url: String(location.pathname),
})

function view (state, actions) {
  const {url} = state
  let {route = null, component = pages.errors[404]} = router.resolve(
    '/' + url.replace(/\/page\.json$/, '').replace(/^\//, ''),
  ) || {}

  let status = route ? 200 : 404
  if (component.fetchRemoteState) {
    status = 0
  }

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
