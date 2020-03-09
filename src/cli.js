import {renderToString} from '@hyperapp/render';

import layout from './app/layout';
import {view, store} from './app';

const url = process.argv[2] || '/';

let title = 'HyperApp';

const body = view({
  ...store,
  isClient: false,
  url,
}, {
  setTitle: (value) => (title = value),
});

console.log(
  renderToString(layout({
    head: {
      title,
    },
    body,
  }))
);
