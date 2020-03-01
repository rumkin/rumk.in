import path from 'path'

import memoize from 'fast-memoize';
import Plant from '@plant/plant';
import {createServer} from '@plant/http';
import {serveDir} from '@plant/fs';
import {renderToString} from '@hyperapp/render';

import {handleError} from './lib/plant-error';

import {actions, store, view} from './app';
import layout from './app/layout';

const render = ({
  url,
  title = 'Application',
}) => renderToString(layout({
  head: {
    title,
  },
  body: view({
    ...store,
    isClient: false,
    url,
  }, actions()),
}));

const PORT = process.argv[2] || 8080;

const plant = new Plant();

plant.use(handleError({
  debug: true,
  logger: console,
}))

plant.use('/assets/*', serveDir(
  path.join(__dirname, 'assets')
))

plant.use(({req, res}) => {
  res.html(render({
    url: req.url.pathname,
    title: 'Paul Rumkin',
  }));
});

const server = createServer(plant);

server.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
