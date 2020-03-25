import {build} from './builder'

async function main({argv}) {
  const input = argv[0]
  const output = argv[1] || '-'

  if (! input) {
    throw new Error('Input path is required. For stdin as input source pass "-" (dash).')
  }

  await build({
    input,
    output,
  })
}

main({
  cms: process.argv.slice(0, 2),
  argv: process.argv.slice(2),
})
.catch((error) => {
  console.error(error)
  return 1
})
.then((code = 0) => process.exit(code))
