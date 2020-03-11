import {set, merge} from '../lib/imm'

export default ({history} = {}) => ({
  setState: (newState) => (state) => merge(state, newState),
  setTitle: (value) => (state) => {
    if (state.isClient) {
      document.title = value;
    }

    return set(state, 'title', value);
  },
  pageLoad: (url) => (state, actions) => {
    return fetchPage(url.replace(/\/+$/, '') + '/page.json')
    .then(({result, error}) => {
      actions.setState({
        isLoading: false,
        page: result,
        error,
      })
    })
  },
  pageGoto: (url) => (state) => {
    if (state.isClient) {
      // if (history.location.pathname + history.location.search !== url) {
        history.push(url);
        // TODO Scroll to top or to anchor.
        window.scrollTo(0, 0);
      // }
    }

    return merge(state, {url, page: null, isLoading: false, error: null})
  },
  pageSet: (url) => (state) => {
    return merge(state, {
      url,
      page: null,
      error: null,
      isLoading: false,
    });
  }
});

function fetchPage(url) {
  return fetch(url, {
    headers: {
      'accept': 'application/json',
    },
  })
  .then(async (res) => {
    const {page} = await res.json()

    return {
      result: page,
      error: null,
    }
  })
  .catch(error => {
    return {
      result: null,
      error,
    }
  })
}
