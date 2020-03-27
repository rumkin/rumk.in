import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {Plain} from '../../layouts/Plain'

export default function E500({shell}, actions) {
  shell.doc.title = `Unknown Error - ${globals.owner}`

  return (
    <Plain>
      <div class="Primal">
        <div class="Primal-body">
          <h1 class="Primal-header">
            Unknown error
          </h1>
          <p class="Primal-intro">
            Something wrong happened. Try refresh the page.
          </p>
        </div>
      </div>
      <p>
        <Link className="Button Button--accent-outline Button--lg" href="/">Start from home</Link>
      </p>
    </Plain>
  )
}
