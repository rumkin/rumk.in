import Config from './Config'

export default class App {
  constructor({config}) {
    this._services = Object.freeze({})
    
    if (config instanceof Config === false) {
      throw new TypeError('Option "config" should be instance of Config')
    }

    Object.defineProperty(this, 'config', {
      value: config,
    })
  }

  get services() {
    return this._services
  }

  register(name, value) {
    if (name in this._services) {
      throw new Error(`Service "${name}" already registered`)
    }

    this._services = Object.freeze({
      ...this._services,
      [name]: value,
    })
  }

  unregister(name) {
    if (name in this._services) {
      const {[name]:_, ...rest} = this._services
      this._services = Object.freeze(rest)
    }
  }
}

function frozenCopy(source) {
  const result = {}

  if (Array.isArray(source)) {
    return Object.freeze(
      source.map(v => frozenCopy(v))
    )
  }
  else if (source.constructor === Object || source.constructor === Date) {
    const result = {}
    for (const [k, v] of Object.entries(source)) {
      result[k] = frozenCopy(v)
    }
    return Object.freeze(result)
  }
  else {
    return source
  }
}
