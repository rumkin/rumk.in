import path from 'path'

import iterateDir from '../utils/iterateDir'

export default function generatePages(root) {
  const files = collectJs(root)

  const imports = []
  const exports = []

  let i = 0
  for (const [route, filepath] of Object.entries(files)) {
    i++
    imports.push(`import * as Page${i} from './pages/${filepath}';`)
    exports.push(`  "${route}": Page${i},`)
  }

  return `${imports.join('\n')}\nexport default {\n${exports.join('\n')}\n}\n`
}

function collectJs(root) {
  const pages = {}

  for (const {filepath, file, stat} of iterateDir(root)) {
    if (stat.isFile() && path.extname(file) === '.jsx') {
      pages[filepath.slice(root.length)] = filepath.slice(root.length + 1)
    }
  }

  return pages
}
