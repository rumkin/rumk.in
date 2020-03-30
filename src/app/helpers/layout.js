import {h} from 'hyperapp'

export function withLayout(layout, component) {
  return function(state, actions) {
    return h(layout, {}, component(state, actions))
  }
}
