class MemoryCache {
  constructor() {
    this.items = new Map()
  }

  get(key) {
    const item = this.items.get(key)

    if (item) {
      return item.value
    }
    else {
      return null
    }
  }

  put(key, value, expires) {
    return this.items.set(key, {value, expires})
  }

  delete(key) {
    this.items.delete(key)
  }
}

export function handleCache({
  lifetime = 5 * 1000,
  cache = new MemoryCache(),
  logger = {info: () => {}},
} = {}) {
  let reset = false
  let timerId

  function planCleanup() {
    if (timerId) {
      reset = true
      return
    }

    timerId = setTimeout(() => {
      logger.info('cleanup')
      timerId = null
      const now = Date.now()
      for (const [key, {expires}] of cache.items.entries()) {
        if (now > expires) {
          logger.info('remove', {key})
          cache.delete(key)
        }
      }

      if (reset) {
        reset = false
        planCleanup()
      }
    }, lifetime)

    logger.info('cleanup_scheduled')
  }

  return async ({req, res}, next) => {
    const {pathname} = req.url
    const data = await cache.get(req.url.pathname)

    if (data) {
      logger.info('got', {pathname})
      res.statusCode = data.statusCode
      for (const [name, value] of data.headers) {
        res.headers.set(name, value)
      }
      res.body = data.body
      return
    }

    await next()

    await cache.put(pathname, {
      statusCode: res.statusCode,
      headers: res.headers.entries(),
      body: res.body,
    }, Date.now() + lifetime)

    planCleanup()
  }
}
