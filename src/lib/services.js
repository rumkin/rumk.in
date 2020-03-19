import path from 'path'
import toCamelCase from 'lodash.camelcase'

import iterateDir from '../lib/iterateDir'

const extnames = [
  '.js',
  '.mjs',
  '.cjs',
]

export function loadFactories(dir) {
  const factories = new Map()
  for (const {filepath, stat} of iterateDir(dir, () => false)) {
    const ext = path.extname(filepath)
    if (stat.isFile() && extnames.includes(ext)) {
      const id = toCamelCase(
        path.basename(filepath, ext)
      )

      factories.set(id, require(filepath).default)
    }
  }
  return factories
}


/**
 * initServices - Load services from service dir, initialize them with a config and
 * register into app.
 *
 * @param {App} app Applicaation instance.
 * @param  {string} dir Directory with services
 * @param  {Promise<Object<string,Object>>} config={} Configuration object where key is service name and value service factory config.
 * @return {App} Returns app
 */
export async function initServices(app, dir, config = {}) {
  const services = {}

  const factories = loadFactories(dir)
  for (const [id, factory] of factories.entries()) {
    // Service disabled
    if (`!${id}` in config) {
      continue
    }
    app.register(id, await factory(config[id], app))
  }

  return app
}
