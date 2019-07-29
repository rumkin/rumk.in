const escapeHtml = require('escape-html')

function defaultRender({error, showDetails}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Error</title>
      <style>
        html {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          font-size: 14px;
          padding: 1em;
        }

        pre {
          font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
          overflow-x: auto;
          background-color: #f9f9f9;
          border-radius: 6px;
          padding: 1em;
        }

        .container {
          margin: 0 auto;
          max-width: 800px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Unknown error</h1>
        <p>Something went wrong and we couldn't render this page.</p>
        <p>Please, contact administrator.</p>
        ${showDetails ? renderErrorDetails({error}) : ''}
      </div>
    </body>
  </html>
  `
}

function renderErrorDetails({error}) {
  return `
    <h3>Details</h3>
    <pre><code>${escapeHtml(error.stack)}</code></pre>
  `
}

function handleError({
  logger,
  debug = false,
  render = defaultRender,
} = {}) {
  return async function plantErrorHandler({res}, next) {
    try {
      await next()
    }
    catch (error) {
      logger && logger.error('Plant Error Handler:', error)
      res.html(
        render({
          error,
          showDetails: debug,
        })
      )
    }
  }
}

exports.handleError = handleError
