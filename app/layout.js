import {h} from 'hyperapp';

export default function Html({head, body}) {
  return (
    <html lang={head.lang || 'en'}>
      <head>
        <title>{head.title}</title>
        <meta charset="utf8" />
        <link rel="stylesheet" href="/assets/app.css" />
        <link rel="shortcut icon" href="/assets/logo,png" type="image/png" />
      </head>
      <body>
        {h('div', {id:'app'}, body)}
        <script src="/assets/app.js"></script>
      </body>
    </html>
  )
}
