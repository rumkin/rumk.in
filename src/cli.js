import {Request, Response} from '@plant/plant'

import router from './app/router'
import handleApp from './app/handle'

async function render(argv) {
  const config = await import(process.cwd() + '/config.json')
  const url = new URL(argv[0] || '/', `${config.protocol}://${config.host}`)

  const handle = handleApp({
    app: {},
    router,
  })

  const req = new Request({url})
  const res = new Response({url})

  await handle({req, res})

  if (! res.hasBody) {
    console.error('Nothing returned')
    return 1
  }

  console.log(res.body)
}

const actions = {
  render,
  help() {
    return this.usage()
  },
  usage() {
    console.log('Usage is:')
    console.log('')
    console.log('- render <page>')
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
