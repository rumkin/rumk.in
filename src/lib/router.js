export class Router {
  constructor(routes = {}) {
    Object.defineProperty(this, '_routes', {
      value: getRoutes(routes),
      enumerable: false,
    })

    this._routes.forEach((route) => {
      this[route.pattern] = route
    })
  }

  addRoute(route) {
    if (route instanceof Route === false) {
      throw new TypeError(`Route should be a Route`)
    }
    else if (route.pattern in this) {
      throw new Error(`Pattern ${route.pattern} already exists`)
    }

    this._routes.push(pattern)
    this[route.pattern] = route
  }

  resolve(url, params = {}) {
    const parts = splitPath(normalizePath(url))

    const route = this._match(parts, params)

    return route
  }

  _match(url, params, pattern = []) {
    for (const route of this._routes) {
      if (route.match(url)) {
        return this._handleMatch(url, route, params, pattern)
      }
    }
  }

  _handleMatch(url, route, params, pattern) {
    if (route.paramName) {
      params = {
        ...params,
        [route.paramName]: route.parse(route.capture ? url.join('/') : url[0]),
      }
    }

    if (route.router) {
      return route.router._match(url.slice(1), params, [...pattern, route.pattern])
    }
    else {
      return {
        pattern: pattern.join(''),
        params: {
          ...route.params,
          ...params,
        },
        value: route.value,
      }
    }
  }
}

class Route {
  constructor({
    pattern,
    paramName = null,
    params = {},
    parse = v => v,
    match = () => true,
    value = null,
    router = null,
    capture = false,
  } = {}) {
    this.pattern = pattern
    this.paramName = paramName
    this.params = params
    this.parse = parse
    this.match = match
    this.value = value
    this.router = router
    this.capture = capture
  }
}

function normalizePath(p) {
  return p.replace(/^\/+/, '')
  .replace(/^\/+$/, '')
  .replace(/\/{2,}/, '/')
}

function splitPath(p) {
  if (p === '') {
    return []
  }
  else {
    return p.split('/')
  }
}

const paramRe = /^\[(\.{3})?([^\]\?]+)?(\??)\]$/

function parseParam(route) {
  const match = route.match(paramRe)
  if (! match) {
    return {}
  }

  let capture = !!match[1]
  let param = match[2]
  let optional = !!match[3]

  if (! capture && ! param && ! optional) {
    throw new Error(`Invalid route "${route}"`)
  }

  return {param, capture, optional}
}

function getRoutes(routes) {
  const result = []

  for (const [route, value] of Object.entries(routes)) {
    if (route.startsWith('/') === false) {
      throw new TypeError(`Invalid route "${route}"}`)
    }

    let item

    if (value instanceof Route) {
      item = new Route({
        ...value,
        pattern: route
      })
    }
    else {
      if (value instanceof Router) {
        item = new Route({
          pattern: route,
          router: value,
        })
      }
      else if (value) {
        item = new Route({
          pattern: route,
          value,
        })
      }
    }

    if (! item) {
      throw new Error(`Invalid route value "${value}"`)
    }

    const {param, capture, optional} = parseParam(route.slice(1))

    if (route === '/') {
      item.match = (p) => p.length === 0

      if (item.router) {
        throw new TypeError(`Bad value for root "${route}"`)
      }
    }
    else if (capture) {
      item.paramName = param
      item.capture = true
      item.match = optional ? () => true : (p) => p.length > 1

      if (item.router && param) {
        throw new TypeError(`Bad value for named capturing route "${route}"`)
      }
    }
    else if (param) {
      item.paramName = param
      item.match = optional ? () => true : (p) => p.length > 0

      if (item.router && optional) {
        throw new TypeError(`Bad value for optional route "${route}"`)
      }
    }
    else {
      const pathname = route.slice(1)
      item.match = (p) => p[0] === pathname
    }

    result.push(item)
  }

  return result
}

export function r(routes) {
  return new Router(routes)
}

export function format(route, params) {
  const parts = splitPath(normalizePath(route))
  .map((part, i, parts) => {
    const {param, optional, capture} = parseParam(part)

    if (param) {
      if (param in params === false && (! optional || i < parts.length - 1)) {
        throw new Error(`Param not specified: "${param}"`)
      }

      return params[param]
    }
    else {
      return part
    }
  })

  return '/' + parts.join('/')
}
