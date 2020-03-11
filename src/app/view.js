import * as pages from './pages'
import {resolve} from './router'

export default function RootView (state, actions) {
  const {route, componentId} = resolve(state.url)

  return pages[componentId].default({
    ...state,
    route,
  }, actions)
}
