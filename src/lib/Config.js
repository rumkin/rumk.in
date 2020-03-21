import {promises as fs} from 'fs'

export default class Config {
  static async load(url) {
    if (typeof url === 'string') {
      url = new URL(url, `file://${process.cwd()}/`)
    }

    if (url.protocol !== 'file:') {
      throw new Error(`Protocol "${url.protocol}" is not a "file:"`)
    }

    const content = await fs.readFile(url, 'utf8')
    let data
    try {
      data = JSON.parse(content)
    }
    catch (error) {
      throw new Error(`File "${url}" is not a valid JSON: ${error.message}`)
    }

    return new this(url, data)
  }

  constructor(url, data) {
    Object.assign(this, data)
    this['$url'] = url
    Object.freeze(this)
  }
}
