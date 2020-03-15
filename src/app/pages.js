import path from 'path'

import iterateDir from '../lib/iterateDir'

const pages = {}

const root = __dirname + '/pages'

for (const {filepath, file, stat} of iterateDir(root)) {
  if (stat.isFile() && path.extname(file) === '.js') {
    pages[filepath.slice(root.length)] = require(filepath)
  }
}

export default pages
