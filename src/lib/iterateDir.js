const path = require('path')
const fs = require('fs')

export default function iterateDir(dir, filter = () => true) {
  return _iterateDir(dir, filter, 0)
}

export function* _iterateDir(dir, filter = () => true, depth = 0) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)

    const data = {filepath, dir, file, stat, depth}
    yield data

    if (stat.isDirectory() && filter(data)) {
      yield* iterateDir(filepath, filter, depth + 1)
    }
  }
}
