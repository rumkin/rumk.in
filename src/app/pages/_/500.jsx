import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {Plain} from '../../layouts/Plain'

export default function E500({shell}, actions) {
  shell.doc.title = 'Unknown Error'

  return (
    <Plain>
      <h1>
        Unknown error
      </h1>
      <p>
        Something wrong happened. Try refresh the page.
      </p>
    </Plain>
  )
}
