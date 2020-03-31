import {promises as fs} from 'fs'
import path from 'path'

import postcss from 'postcss'
import atImport from 'postcss-import'

import {readStream} from '../utils/readStream'

export async function build({
  input,
  output,
}) {
  const source = input === '-'
    ? await readStream(process.stdin, 'utf8')
    : await fs.readFile(input, 'utf8')
  const mapOpts = input === '-'
    ? {inline: true}
    : {inline: false}

  const {css, map} = await postcss([
    atImport,
  ])
  .process(source, {
    from: input,
    to: output,
    map: mapOpts,
  })

  if (output === '-') {
    console.log(css)
  }
  else {
    const dir = path.dirname(output)
    await fs.mkdir(dir, {recursive: true})
    await fs.writeFile(output, css)
    await fs.writeFile(`${output}.map`, JSON.stringify(map))
  }
}
