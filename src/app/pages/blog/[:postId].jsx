import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {Post} from '../../components/Post'
import {withLoader} from '../../helpers/loader'
import {withLayout} from '../../helpers/layout'
import {InnerWide} from '../../layouts/Inner'

function BlogPost(state, actions) {
  const {
    status,
    route,
    shell,
    page,
    globals,
  } = state

  shell.doc.title = `${page.head.title} - ${globals.owner}`

  return (
    <Post post={page} />
  )
}

export default withLayout(
  InnerWide,
  withLoader(
    <div class="container">Loading...</div>,
    BlogPost,
  ),
)

export async function fetchRemoteState({route}, {blog}) {
  const post = await blog.getPost(route.params.postId)

  if (! post) {
    return
  }

  return {
    id: post.id,
    head: post.head,
    body: post.body,
  }
}

export async function listPages({blog}) {
  return (await blog.listPosts())
  .map(({id}) => ({postId: id}))
}

export async function listPageAssets({postId}, {blog}) {
  const post = await blog.getPost(postId)

  return post ? post.assets : []
}
