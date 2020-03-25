import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {Plain} from '../../layouts/Plain'

export default function E404({shell}, actions) {
  shell.doc.title = 'Nothing Found'

  return (
    <Plain>
      <div class="Primal">
        <div class="Primal-body">
          <h1 class="Primal-header">
            Nothing found
          </h1>
          <p class="Primal-intro">
            There is no such page.
          </p>
        </div>
      </div>
      <p>
        <Link className="Button Button--accent-outline Button--lg" href="/">Start from home</Link>
      </p>
    </Plain>
  )
}
