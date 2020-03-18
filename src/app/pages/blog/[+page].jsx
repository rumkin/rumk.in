import {h} from 'hyperapp'

import {Link} from '../../components/link'
import {Inner} from '../../layouts/Inner'

export default function BlogPost(state, actions) {
  const {status, route, shell, page} = state

  shell.doc.title = 'Blog Posts'

  return (
    <Inner>
      <h1>
        Posts on page #{route.params.page}
      </h1>
      <div>
        <p>
          Posts lists:
        </p>
        <ul></ul>
      </div>
    </Inner>
  )
}

export async function fetchRemoteState({route}, {blog}) {
  const page = route.params.page - 1
  const posts = await blog.listPosts({
    offset: page * 10,
    limit: 10,
  })

  return posts.map((post) => post.head)
}

export async function listPages({blog}) {
  const count = await blog.countPosts()
  const pagesCount = Math.ceil(count / 10)

  const pages = new Array(pagesCount)
  for (let i = 0; i < pagesCount; i++) {
    pages[i] = {page: i+1}
  }

  return pages
}
