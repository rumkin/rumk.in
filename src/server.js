import path from 'path'

import memoize from 'fast-memoize';
import Plant from '@plant/plant';
import {createServer} from '@plant/http';
import {serveDir} from '@plant/fs';
import {renderToString} from '@hyperapp/render';

import {handleError} from './lib/plant/error';
import {handleCache} from './lib/plant/cache';

import {actions, pages, resolve} from './app';
import layout from './app/layout';

const render = (view, {
  url,
  title = 'Application',
  ...state
}) => renderToString(layout({
  head: {
    title,
  },
  body: view({
    isClient: false,
    url,
    ...state,
  }, actions()),
  state,
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

// Cache files
plant.use(handleCache())

plant.use(async ({req, res}) => {
  const {url} = req
  const isJson = url.pathname.endsWith('.json')
  const {route, component} = resolve(url.pathname.replace(/\.json$/, ''))
  const {fetchRemoteState} = pages[component]

  let page
  if (fetchRemoteState) {
    page = await fetchRemoteState({url, route}, {
      // DB, etc
    })
  }
  else {
    page = {}
  }

  if (isJson) {
    res.json({page})
  }
  else {
    res.html(render(pages[component].default, {
      url: url.pathname,
      title: 'Paul Rumkin',
      route,
      page,
    }));
  }
});

function match(req, types) {
  const {other, ...custom} = types
  const type = req.accept(Object.keys(types))

  if (type in custom) {
    return custom[type](req)
  }
  else {
    return other(req)
  }
}

const server = createServer(plant);

server.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
