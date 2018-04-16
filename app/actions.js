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
    if (history.location.pathname !== url) {
      history.push(url);
    }

    return imm.set(state, 'url', url);
  },
});
