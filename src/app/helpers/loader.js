import {h} from 'hyperapp'

export function withLoader(...args) {
  const component = args.pop()
  const indicator = args[0] || h('div', {}, 'Loading...')

  return (state, actions) => {
    const {isLoading, error, page, status} = state

    if (! page) {
      if (status === 0 && ! isLoading) {
        actions.pageLoad(state.url)
      }

      return indicator
    }
    else if (error) {
      return h('div', {}, `Error ${error + ''}`)
    }
    else {
      return component(state, actions)
    }
  }
}
