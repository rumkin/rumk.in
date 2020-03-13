import {set, merge} from '../lib/imm'

export default ({history, shell} = {}) => ({
  setState: (newState) => (state) => merge(state, newState),
  setTitle: (value) => (state) => {
    shell.doc.title = value
  },
  pageLoad: (url) => (state, actions) => {
    actions.setState({
      isLoading: true,
    })

    return fetchPage(shell, new URL(
      url.pathname.replace(/\/+$/, '') + '/page.json', url
    ))
    .then(({result: {status, page}, error}) => {
      actions.setState({
        isLoading: false,
        status,
        page,
        error,
      })
    })
  },
  pageGoto: (url) => (state) => {
    if (! shell.isStatic) {
      history.push(url)
      // TODO Scroll to top or to anchor.
      window.scrollTo(0, 0)
    }
  },
  pageNavigated: (to, from) => (state) => {
    return merge(state, {
      url: to,
      status: 0,
      page: null,
      error: null,
      isLoading: false,
    });
  }
});

function fetchPage(shell, url) {
  return shell.fetch(url, {
    headers: {
      'accept': 'application/json',
    },
  })
  .then(async (res) => {
    const status = res.statusCode
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
