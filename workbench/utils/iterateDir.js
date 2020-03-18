import fs from 'fs'
import path from 'path'

export default function * iterateDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)

    yield {filepath, dir, file, stat}

    if (stat.isDirectory()) {
      yield* iterateDir(filepath)
    }
  }
}
