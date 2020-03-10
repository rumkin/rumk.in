import {app} from 'hyperapp'
import {createBrowserHistory} from 'history'

import {actions, getJson, view, pages, resolve} from './app'

const history = createBrowserHistory()

const state = Object.assign({}, getJson('/state.json'), {
  isClient: true,
  url: String(location.pathname),
})

const root = document.getElementById('app');
const main = app(state, actions({history}), view, root)

history.listen((location) => {
  const path = location.pathname + location.search
  main.pageSet(path)
})
