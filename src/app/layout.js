import {h} from 'hyperapp';

export default function Html({head, body, state}) {
  return (
    <html lang={head.lang || 'en'}>
      <head>
        <title>{head.title}</title>
        <meta charset="utf8" />
        <link rel="stylesheet" href="/assets/app.css" />
        <link rel="shortcut icon" href="/assets/logo.png" type="image/png" />
      </head>
      <body>
        <div id="app">{body}</div>
        <script id="/state.json" type="application/json">{JSON.stringify(state)}</script>
        <script src="/assets/app.js"></script>
      </body>
    </html>
  )
}
