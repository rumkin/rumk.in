import * as pages from './pages'
import {resolve} from './router'

export default function RootView (state, actions) {
  const {route, component} = resolve(state.url)

  return pages[component].default({
    ...state,
    route,
  }, actions)
}
