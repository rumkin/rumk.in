import {promises as fs} from 'fs'
import path from 'path'
import {createHash} from 'crypto'

import iterateDir from '../utils/iterateDir'

import Compiler from './compiler'

export async function build({
  input,
  output,
  compiler = new Compiler(),
}) {
  const files = collectByExtname(input, '.md')

  for (const file of files) {
    const sourceDir = path.join(input, path.dirname(file.filepath))
    const destDir = path.join(output, path.dirname(file.filepath))

    const content = await fs.readFile(
      path.join(input, file.filepath)
    )

    const hash = sha256(content)
    const fileDir = path.join(output, file.filepath)
    const hashFile = path.join(fileDir, 'hash')
    let dirExists
    let isExported = false
    try {
      const prevHash = await fs.readFile(hashFile, 'utf8')
      dirExists = true
      if (prevHash === hash) {
        isExported = true
      }
    }
    catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }

    if (! dirExists) {
      await fs.mkdir(fileDir, {recursive: true})
    }

    await linkAssets(sourceDir, destDir)

    if (! isExported) {
      // TODO use compiler output format:
      // {errors:[], output: []}
      const {output: {head, body}} = await compiler.compile(content, {
        filename: file.filepath,
      })

      await fs.writeFile(hashFile, hash)
      await fs.writeFile(
        path.join(fileDir, 'head.json'),
        JSON.stringify(head, null, 2),
      )
      await fs.writeFile(
        path.join(fileDir, 'body.json'),
        JSON.stringify(body, null, 2),
      )
    }
  }
}

async function linkAssets(sourceDir, destDir) {
  const source = path.join(sourceDir, 'assets')
  const dest = path.join(destDir, 'assets')

  if (await stat(source)) {
    if (! await stat(dest)) {
      await fs.symlink(
        path.resolve(source),
        dest,
      )
    }
  }
  else {
    if (await stat(dest)) {
      await fs.unlink(dest)
    }
  }
}

export async function list(dir) {
  const files = collectByBasename(dir, 'head.json')
  const index = []

  for (const file of files) {
    index.push({
      file: path.dirname(file.filepath),
      head: await readJson(
        path.join(dir, file.filepath)
      ),
    })
  }

  console.log(index)
}

async function readJson(filepath) {
  try {
    return JSON.parse(
      await fs.readFile(filepath)
    )
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON ${filepath}`)
    }
    else {
      throw error
    }
  }
}

async function stat(filepath) {
  try {
    return await fs.stat(filepath)
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      return
    }

    throw error
  }
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

function groupFilters(fs) {
  return function filter(value) {
    for (const f of fs) {
      if (f(value) !== true) {
        return false
      }
    }
    return true
  }
}

function isFile({stat}) {
  return stat.isFile()
}

function extnameIs({filepath}, extname) {
  return path.extname(filepath) === extname
}

function basenameIs({filepath}, basename) {
  return path.basename(filepath) === basename
}

function collectByExtname(dir, extname) {
  return collectFiles(
    dir,
    groupFilters([
      v => isFile(v),
      v => extnameIs(v, extname),
    ])
  )
}

function collectByBasename(dir, basename) {
  return collectFiles(
    dir,
    groupFilters([
      v => isFile(v),
      v => basenameIs(v, basename),
    ])
  )
}

function collectFiles(dir, filter) {
  const output = []

  for (const file of iterateDir(dir)) {
    if (filter(file)) {
      const {filepath, stat} = file
      output.push({
        dir,
        filepath: filepath.slice(dir.length + 1),
        stat,
      })
    }
  }

  return output
}
