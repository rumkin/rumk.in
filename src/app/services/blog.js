import path from 'path'
import {promises as fs} from 'fs'

import iterateDir from '../../lib/iterateDir'

export default async function blog(config, app) {
  const dir = path.resolve(
    app.config.root || process.cwd(), config.dir
  )

  const files = await collectFiles(dir)
  const posts = []

  for (const file of files) {
    const body = await readJson(
      path.join(dir, file.filepath, 'body.json')
    )
    const head = await readJson(
      path.join(dir, file.filepath, 'head.json')
    )

    let assets = []
    const assetsDir = path.join(dir, file.dir, 'assets')
    if (await stat(assetsDir)) {
      for (const asset of iterateDir(assetsDir)) {
        if (asset.stat.isFile()) {
          assets.push({
            filepath: asset.filepath,
            url: path.join('assets', asset.filepath.slice(assetsDir.length)),
          })
        }
      }
    }

    posts.push({
      id: path.basename(file.dir),
      head,
      body,
      assets,
    })
  }

  return {
    async getPost(id) {
      return posts.find((post) => post.id === id)
    },
    async countPosts() {
      return posts.length
    },
    async listPosts({
      offset = 0,
      limit = Infinity,
    } = {}) {
      return posts.slice(offset, limit)
    }
  }
}

function collectFiles(dir) {
  const files = []
  for (const file of iterateDir(dir)) {
    if (file.stat.isDirectory() && file.filepath.endsWith('.md')) {
      const filepath = file.filepath.slice(dir.length + 1)
      files.push({
        dir: path.dirname(filepath),
        filepath,
      })
    }
  }
  return files
}

async function readJson(filepath) {
  const content = await fs.readFile(filepath)

  try {
    return JSON.parse(content)
  }
  catch (error) {
    throw new ParseError(`Invalid JSON in "${filepath}": ${error} `)
  }
}

async function stat(filepath) {
  try {
    return await fs.stat(filepath)
  }
  catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}
