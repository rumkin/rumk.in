const {h} = require('hyperapp');

module.exports = ({head, body}) => h('html', {},
  h('head', {},
    h('title', {}, head.title),
    h('link', {
      href: '/assets/app.css',
      rel: 'stylesheet',
    }),
    h('link', {
      href: '/assets/logo.png',
      rel: 'shortcut icon',
      type: 'image/png',
    }),
  ),
  h('body', {}, [
    h('div', {id: 'app'}, body),
    h('script', {
      src: '/assets/app.js',
    }),
  ]),
);
