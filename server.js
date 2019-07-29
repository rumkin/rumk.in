const path = require('path')

const memoize = require('fast-memoize');
const Plant = require('@plant/plant');
const {createServer} = require('@plant/http');
const {serveDir} = require('@plant/fs')
const {renderToString} = require('@hyperapp/render');

const {handleError} = require('./lib/plant-error');
const layout = require('./app/layout');
const {actions, store, view} = require('./app');

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
  path.join(__dirname, 'dist', 'assets')
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
