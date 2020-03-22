import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {Plain} from '../../layouts/Plain'

export default function E404({shell}, actions) {
  shell.doc.title = 'Nothing Found'

  return (
    <Plain>
      <h1>
        Page not found
      </h1>
      <p>
        Sorry. There is no such page. Try to look on
        the <Link href="/">main page</Link>.
      </p>
    </Plain>
  )
}
