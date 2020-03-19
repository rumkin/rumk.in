import {h} from 'hyperapp'

export function withLoader(component) {
  return (state, actions) => {
    const {isLoading, error, page, status} = state

    if (! page) {
      if (status === 0 && ! isLoading) {
        actions.pageLoad(state.url)
      }

      return (
        <div>Loading...</div>
      )
    }
    else if (error) {
      return <div>Error {error + ''}</div>
    }
    else {
      return component(state, actions)
    }
  }
}
