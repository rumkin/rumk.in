import {set} from '../lib/imm'

export default ({history} = {}) => ({
  setTitle: (value) => (state) => {
    if (state.isClient) {
      document.title = value;
    }

    return set(state, 'title', value);
  },
  pageGoto: (url) => (state) => {
    if (state.isClient) {
      // TODO Get whole path.
      if (history.location.pathname !== url) {
        history.push(url);
        // TODO Scroll to top or to anchor.
        window.scrollTo(0, 0);
      }
    }


    return set(state, 'url', url);
  },
});
