import {h} from 'hyperapp'

import {Link} from '../../components/link'
import {Inner} from '../../layouts/Inner'

export default function BlogPost(state, actions) {
  const {status, route, shell, page} = state

  shell.doc.title = 'Blog Post'

  return (
    <Inner>
      <h1>
        {page.title || 'Post not found'}
      </h1>
      <p>
        Status: {status}
      </p>
      <p>
        Post ID: {route.params.page}
      </p>
    </Inner>
  )
}

export async function fetchRemoteState({route}, {db}) {
  return db.get(`blog:${route.params.page}`)
}

export async function listPages() {
  return [
    {page: 1},
    {page: 2},
  ]
}
