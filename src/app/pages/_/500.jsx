import {h} from 'hyperapp'

import {Link} from '../../components/link'
import {Plain} from '../../layouts/plain'

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
