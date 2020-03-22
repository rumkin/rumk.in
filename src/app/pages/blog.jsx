import {h} from 'hyperapp';

import {Link} from '../components/Link';
import {Inner} from '../layouts/Inner'

export default function Blog({shell}, actions) {
  shell.doc.title = 'Blog'

  return (
    <Inner>
      <h1>
        Blog
      </h1>
      <p>
        Sorry. There is nothing on this page.
      </p>
      <p>
        Visit <Link href="/">main page</Link>.
      </p>
    </Inner>
  )
}
