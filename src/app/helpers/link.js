import {h} from 'hyperapp'

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

export const Link = (props, children) => (state, actions) => (
  <a
    {...props}
    onclick={goto(() => actions.pageGoto(props.href))}
  >
    {children}
  </a>
)
