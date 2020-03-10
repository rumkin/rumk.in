export function handleLogger(logger) {
  return async function({req, res}, next) {
    try {
      await next()
    }
    finally {
      logger.log('%s %s %s', res.status, req.method, res.url.pathname)
    }
  }
}
