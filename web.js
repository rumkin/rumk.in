import {app} from 'hyperapp';
import {createBrowserHistory} from 'history';

import {actions, store, view} from './app';


const history = createBrowserHistory();

const state = Object.assign({}, store, {
  isClient: true,
  url: String(location.pathname),
});

const root = document.getElementById('app');
const main = app(state, actions({history}), view, root);

history.listen((location) => {
  main.pageGoto(location.pathname);
});
