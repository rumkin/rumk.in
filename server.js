const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const {promisify} = require('util');
const memoize = require('fast-memoize');
const Plant = require('@Plant/plant');
const {renderToString} = require('@hyperapp/render');

const fsStat = promisify(fs.stat);
const fsExists = promisify(fs.exists);

const layout = require('./app/layout');
const {actions, store, view} = require('./app');

const render = (url) => renderToString(layout({
  head: {
    title: 'HyperApp',
  },
  body: view({
    ...store,
    isClient: false,
    url,
  }, actions()),
}));

const PORT = process.argv[2] || 8080;

const plant = new Plant();

plant.use(async ({req, res}, next) => {
  const url = path.resolve('/', req.url.pathname);

  if (! url.startsWith('/assets/')) {
    return next();
  }

  const filepath = path.join(__dirname, 'dist', url.slice(8));

  if (! await fsExists(filepath)) {
    return next();
  }

  const stat = await fsStat(filepath);

  if (! stat.isFile()) {
    return;
  }

  res.headers.set('content-type', mime.getType(filepath));
  res.headers.set('content-length', stat.size);
  res.body = fs.createReadStream(filepath);
});

plant.use(({req, res}) => {
  res.html(render(req.url.pathname));
});

const server = http.createServer(plant.handler());

server.listen(PORT, () => {
  console.log('Server is started');
});
