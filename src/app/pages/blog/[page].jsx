import {h} from 'hyperapp'

import {Link} from '../../components/link'
import {Inner} from '../../layouts/Inner'

export default function BlogPost(state, actions) {
  const {status, route, shell} = state

  shell.doc.title = 'Blog Post'

  return (
    <Inner>
      <h1>
        Blog Page
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

export async function fetchRemoteState({route}, services) {
  // const {page = '1'} = route.params
  //
  // if (! page.match(/^\d$/)) {
  //   return
  // }
  //
  // const articles = await services.db.list(
  //   'blog:previews',
  //   {
  //     page: parseInt(page, 10),
  //     count: 10,
  //   }
  // )
  //
  // return {
  //   articles,
  // }
}
