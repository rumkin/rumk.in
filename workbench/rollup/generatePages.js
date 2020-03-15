import path from 'path'

import iterateDir from '../utils/iterateDir'

/**
 * generatePages - create a JS file which imports all components from pages
 * directory. It's required to simulate node.js a-like behavior which imports
 * scripts by scrapping file system.
 *
 * @param  {string} root Directory to scrap.
 * @param  {string} as   Directory to resolve relative paths to.
 * @return {string}      Generated JS source.
 */

export default function generatePages(root, as) {
  const files = collectJs(root, '.jsx')
  const prefix = path.relative(as, root)

  const imports = []
  const exports = []

  let i = 0
  for (const [route, filepath] of Object.entries(files)) {
    i++
    imports.push(`import * as Page${i} from './${prefix}/${filepath}';`)
    exports.push(`  "${route}": Page${i},`)
  }

  return `${imports.join('\n')}\nexport default {\n${exports.join('\n')}\n}\n`
}


/**
 * collectJs - recursively scraps filesystem for and select files with specific extension.
 * @param  {string} root Directory root.
 * @param  {string} extname = '.js' Extension to select.
 * @return {Object<string,string>} Map where key is a file path with trailing '/'
 * and a value is a filepath without it.
 * @example
 * // collectJs(root, '.js') // -> {'/index.js': 'index.js'}
 */
function collectJs(root, extname = '.js') {
  const pages = {}

  for (const {filepath, file, stat} of iterateDir(root)) {
    if (stat.isFile() && path.extname(file) === extname) {
      pages[filepath.slice(root.length)] = filepath.slice(root.length + 1)
    }
  }

  return pages
}
