import {promises as fs} from 'fs'
import path from 'path'

import {Request, Response} from '@plant/plant'

import App from './lib/App'
import Config from './lib/Config'
import {normalizeRoutes} from './lib/createRouter'
import {initServices} from './lib/services'
import {format} from './lib/Router'

import router from './app/router'
import handleApp from './app/handle'

function createCompiler({
  app,
  router,
  config,
}) {
  const handle = handleApp({app, router})

  return async function (pathname) {
    const url = new URL(pathname, `${config.protocol}://${config.host}`)

    const req = new Request({url})
    const res = new Response({url})

    await handle({req, res})

    return res
  }
}

async function render(argv) {
  const config = await Config.load('config.json')
  const app = new App({config})

  await initServices(
    app,
    path.join(__dirname, '/app/services'),
    config.services,
  )

  const compile = createCompiler({
    app,
    router,
    config,
  })

  const res = await compile(argv[0] || '/')
  if (! res.hasBody) {
    console.error('Nothing returned')
    return 1
  }

  console.log(res.body)
}

function shouldSkip(filepath, rules) {
  for (const rule of rules) {
    if (typeof rule === 'string') {
      if (filepath === rule) {
        return true
      }
    }
    else if (typeof rule === 'function') {
      if (rule(filepath) === true) {
        return true
      }
    }
  }

  return false
}

async function cloneAssets({
  output,
  pathname,
  assets,
}) {
  const dir = path.join(output, pathname)
  await fs.mkdir(dir, {recursive: true})
  let dirs = new Set()

  for (const asset of assets) {
    const assetDir = path.dirname(asset.url)
    if (! dirs.has(assetDir)) {
      await fs.mkdir(
        path.join(dir, assetDir),
        {recursive: true},
      )
      dirs.add(assetDir)
    }

    await fs.copyFile(
      asset.filepath,
      path.join(dir, asset.url)
    )
  }
}

async function buildWithRouter({
  baseUrl = '',
  app,
  router,
  compile,
  output,
  skip = [],
}) {
  for (const route of router._routes) {
    const fullPath = `${baseUrl}${route.pattern}`

    if (shouldSkip(fullPath, skip)) {
      continue
    }

    const component = route.value
    if (component) {
      if (route.paramName) {
        const hasPageAssets = !! component.listPageAssets
        if (!! component.listPages) {
          const pages = await component.listPages(app.services, app)
          for (const page of pages) {
            const pathname = format(fullPath, page)
            await buildPage({
              compile,
              output,
              pathname,
            })

            if (hasPageAssets) {
              const assets = await component.listPageAssets(page, app.services, app)
              await cloneAssets({
                output,
                pathname,
                assets,
              })
            }
          }
        }

        if (!! component.listAssets) {
          const assets = await component.listAssets(app.services, app)
          await cloneAssets({
            output,
            pathname: fullPath,
            assets,
          })
        }
      }
      else if (component.default) {
        await buildPage({
          compile,
          output,
          pathname: fullPath,
        })
      }
    }
    else if (route.router) {
      await buildWithRouter({
        baseUrl: fullPath,
        app,
        router: route.router,
        compile,
        output,
        skip,
      })
    }
  }
}

async function buildPage({
  pathname,
  compile,
  output,
}) {
  const res = await compile(pathname)

  if (! res.hasBody) {
    throw new Error(`Invalid page: ${pathname}`)
  }
  else if (res.status !== 200) {
    throw new Error(`Status code #${res.status}: ${pathname}`)
  }

  const dir = path.join(output, pathname)
  await fs.mkdir(dir, {recursive: true})

  await fs.writeFile(path.join(output, `${pathname}/index.html`), res.body)

  const pageJsonPush = res.pushes.find(
    ({response}) => response && response.url.pathname.endsWith('/page.json')
  )

  if (pageJsonPush) {
    await fs.writeFile(
      path.join(output, `${pathname}/page.json`),
      pageJsonPush.response.body,
    )
  }
}

async function build(argv) {
  const config = await Config.load('config.json')

  let output
  if (argv.length > 0) {
    output = path.resolve(argv[0])
  }
  else {
    output = path.resolve(config['$url'], config.outDir)
  }

  const app = new App({config})

  await initServices(
    app,
    path.join(__dirname, '/app/services'),
    config.services,
  )

  const compile = createCompiler({
    app,
    router,
    config,
  })

  await buildWithRouter({
    app,
    compile,
    router,
    output,
    skip: [
      // Skip static 500 error generation
      '/_/500',
    ],
  })

  console.log('Complete')
}

const actions = {
  render,
  build,
  help() {
    return this.usage()
  },
  usage() {
    console.log('Usage is:')
    console.log('')
    console.log('- render <page>')
    console.log('- build [output]')
  }
}

async function main(argv) {
  const action = argv[2]

  if (action in actions) {
    return actions[action](argv.slice(3))
  }
  else {
    return actions.usage(argv.slice(2))
  }
}

function getJsonPath(pathname) {
  return `${pathname.replace(/\/+$/, '')}/page.json`
}

main(process.argv)
.catch((error) => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
