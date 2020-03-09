import {set, merge} from '../lib/imm'

export default ({history} = {}) => ({
  setState: (newState) => (state) => merge(state, newState),
  setTitle: (value) => (state) => {
    if (state.isClient) {
      document.title = value;
    }

    return set(state, 'title', value);
  },
  loadPage: (url) => (state, actions) => {
    return Promise.all([
      fetchPage((url === '/' ? 'home' : url) + '.json'),
      delay(200),
    ])
    .then(([result]) => {
      actions.setState(result)
    })
  },
  pageGoto: (url, isLoading = false) => (state) => {
    if (state.isClient) {
      // TODO Get whole path.
      if (history.location.pathname !== url) {
        history.push(url);
        // TODO Scroll to top or to anchor.
        window.scrollTo(0, 0);
      }
    }

    return merge(state, {
      url,
      page: {},
      error: null,
      isLoading: true,
    });
  },
});

function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

function fetchPage(url) {
  return fetch(url, {
    headers: {
      'accept': 'application/json',
    },
  })
  .then(async (res) => {
    const {page} = await res.json()

    return {
      page,
      isLoading: false,
      error: null,
    }
  })
  .catch(error => {
    return {
      page: {},
      isLoading: false,
      error,
    }
  })
}
