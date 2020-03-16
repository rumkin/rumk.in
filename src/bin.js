import {promises as fs} from 'fs'
import path from 'path'

import {Request, Response} from '@plant/plant'

import App from './lib/app'
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
  const config = await import(process.cwd() + '/config.json')

  const app = new App({config})

  initServices(
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

async function buildWithRouter({
  prefix = '',
  app,
  router,
  compile,
  output,
  skip = [],
}) {
  for (const route of router._routes) {
    const prefixed = `${prefix}${route.pattern}`

    if (shouldSkip(prefixed, skip)) {
      continue
    }

    if (route.value) {
      if (route.paramName) {
        if (typeof route.value.listPages === 'function') {
          const pages = await route.value.listPages(app)
          for (const page of pages) {
            const pathname = format(prefixed, page)
            await buildPage({
              compile,
              output,
              pathname,
            })
          }
        }
      }
      else {
        await buildPage({
          compile,
          output,
          pathname: prefixed,
        })
      }
    }

    if (route.router) {
      await buildWithRouter({
        prefix: prefixed,
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
  const config = await import(process.cwd() + '/config.json')
  const output = argv.length > 0 ? argv[0] : config.outDir


  const app = new App({config})

  initServices(
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
    app: {},
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
