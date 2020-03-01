import {
  mainPage,
  notFoundPage,
} from './pages';

export default (state, actions) => {
  switch (state.url) {
    case '/':
      return mainPage(state, actions);
    default:
      return notFoundPage(state, actions);
  }
};
