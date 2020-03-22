import {h} from 'hyperapp'

import {addTrailingSlash} from '../lib/url'

export default function Html({
  doc,
  output,
  state: {shell, route, ...state},
}) {
  return (
    <html lang={doc.lang || 'en'}>
      <head>
        <title>{doc.title}</title>
        <meta charset="utf8" />
        <base href={addTrailingSlash(shell.url.pathname)}/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/assets/app.css" />
        <link rel="shortcut icon" href="/assets/logo.png" type="image/png" />
        {[...doc.metatags].map(([, meta]) => {
          return h('meta', meta)
        })}
      </head>
      <body>
        <div id="app">{output}</div>
        <script id="/state.json" type="application/json">{JSON.stringify(state)}</script>
        <script src="/assets/app.js"></script>
      </body>
    </html>
  )
}
