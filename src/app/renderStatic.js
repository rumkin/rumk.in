import {renderToString} from '@hyperapp/render'

import actions from './actions'
import layout from './layout'

export default function render(view, state) {
  const {shell} = state
  const output = view(state, actions({
    shell,
  }))

  return renderToString(layout({
    doc: shell.doc,
    output,
    state,
  }))
}
