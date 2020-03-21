import {build, list} from './builder'

function usageCmd() {
  console.log('Usage is:')
  console.log('')
  console.log('- build <input> <output>')
  console.log('- read <input>')
}

function readCmd({
  argv,
}) {
  return list(argv[0])
}

function buildCmd({
  argv,
}) {
  if (! argv[0]) {
    throw new Error('Input argument is required')
  }

  if (! argv[1]) {
    throw new Error('Output argument is required')
  }

  return build({
    input: argv[0],
    output: argv[1],
  })
}

async function main({cmd, argv}) {
  switch (argv[0]) {
  case 'build':
    return buildCmd(
      shiftArgv({cmd, argv})
    )
  case 'read':
    return readCmd(
      shiftArgv({cmd, argv})
    )
  default:
    return usageCmd(
      shiftArgv({cmd, argv})
    )
  }
}

function shiftArgv({cmd, argv}, n = 1) {
  return {
    cmd: [...cmd, ...argv.slice(0, n)],
    argv: argv.slice(n),
  }
}

main({
  cmd: process.argv.slice(0, 2),
  argv: process.argv.slice(2),
})
.catch(error => {
  console.error('%o', error)
  return 1
})
.then((code = 0) => process.exit(code))
