const {
  mainPage,
  notFoundPage,
} = require('./pages');

const app = (state, actions) => {
  switch (state.url) {
    case '/':
      return mainPage(state, actions);
    default:
      return notFoundPage(state, actions);
  }
};

module.exports = app;
