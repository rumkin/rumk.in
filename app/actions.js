const imm = require('../lib/imm');

const setTitle = (value) => {
  if (typeof document === 'undefined') {
    return;
  }

  const node = document.head.querySelector('title');
  node.textContent = value;
}

module.exports = ({history} = {}) => ({
  setTitle: (value) => (state) => {
    setTitle(value);

    return imm.set(state, 'title', value);
  },
  pageGoto: (url) => (state) => {
    // TODO Get whole path.
    if (history.location.pathname !== url) {
      history.push(url);
      // TODO Scroll to top or to anchor.
      window.scrollTo(0, 0);
    }

    return imm.set(state, 'url', url);
  },
});
