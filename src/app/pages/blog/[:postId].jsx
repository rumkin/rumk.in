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
        Post ID: {route.params.postId}
      </p>
    </Inner>
  )
}

export async function fetchRemoteState({route}, {blog}) {
  return blog.getPost(route.params.postId)
}

export async function listPages() {
  return [
    {postId: 'a'},
    {postId: 'b'},
  ]
}

export async function listPageAssets() {
  return [
    {
      filepath: 'assets/app.css',
      url: './assets/app.css',
    }
  ]
}
