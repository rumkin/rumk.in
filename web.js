const {app} = require('hyperapp');
const {createBrowserHistory} = require('history');

const {actions, store, view} = require('./app');
const imm = require('./lib/imm');

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
