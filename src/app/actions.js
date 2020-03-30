import {set, merge} from '../lib/imm'
import fooid from '../lib/fooid'
import {addTrailingSlash} from '../lib/url'

export default ({history, shell, cache, heights} = {}) => {
  return {
    setState: ({update, stateId}) => (state) => {
      if (stateId === state.stateId) {
        const nextState = merge(state, update)
        cache.set(stateId, nextState)
        return nextState
      }
      else {
        cache.set(stateId, merge(cache.get(stateId), update))
        return state
      }
    },
    setTitle: (value) => (state) => {
      shell.doc.title = value
    },
    pageLoad: (url) => ({stateId}, actions) => {
      actions.setState({
        stateId,
        update: {
          isLoading: true,
        },
      })

      const pageUrl = new URL(url, shell.url)
      pageUrl.pathname += '/page.json'
      pageUrl.search = ''
      pageUrl.hash = ''

      return fetchPage(shell, pageUrl)
      .then(({result: {status, page}, error}) => {
        actions.setState({
          update: {
            isLoading: false,
            status,
            page,
            error,
          },
          stateId,
        })
      })
    },
    pageGoto: (url) => (state) => {
      if (! shell.isStatic) {
        const stateId = fooid()
        const height = history.length + 1
        url = addTrailingSlash(url)

        history.push(url, {stateId, height})

        for (const [h, s] of heights.entries()) {
          if (h >= height) {
            cache.delete(s)
            heights.delete(h)
          }
        }

        heights.set(height, stateId)

        // TODO Scroll to top or to anchor.
        window.scrollTo(0, 0)
        const base = document.head.querySelector('base')
        base.href = url
        // document.baseURI = window.location.origin + url
      }
    },
    pageNavigated: ({to, from, stateId, height}) => (state) => {
      if (! cache.has(stateId)) {
        cache.set(stateId, {
          stateId,
          url: to.href.slice(to.origin.length),
          status: 0,
          page: null,
          error: null,
          isLoading: false,
        })
        heights.set(height, stateId)
      }

      return cache.get(stateId)
    }
  }
}

function fetchPage(shell, url) {
  return shell.fetch(url, {
    headers: {
      'accept': 'application/json',
    },
  })
  .then(async (res) => {
    const status = res.status
    const {page} = await res.json()

    return {
      result: {status, page},
      error: null,
    }
  })
  .catch(error => {
    return {
      result: {status: 500, page: null},
      error,
    }
  })
}
