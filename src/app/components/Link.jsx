import {h} from 'hyperapp'

import {format} from '../../lib/Router'
import {addTrailingSlash} from '../../lib/url'

function linkGoto(fn, e) {
  if (e.which !== 1 || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
    return
  }

  e.preventDefault()

  fn(e)
}

export function goto(fn) {
  return linkGoto.bind(null, fn)
}

export const Link = ({href, route, params = {}, ...props}, children) => (state, actions) => {
  href = addTrailingSlash(
    href || format(route, params || {})
  )

  return (
    <a
      {...props}
      href={href}
      onclick={goto(() => actions.pageGoto(href))}
    >
      {children}
    </a>
  )
}
