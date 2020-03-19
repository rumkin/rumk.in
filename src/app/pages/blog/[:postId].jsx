import {h} from 'hyperapp'

import {Link} from '../../components/link'
import {withLoader} from '../../helpers/loader'
import {Inner} from '../../layouts/Inner'

function BlogPost(state, actions) {
  const {status, route, shell, page} = state

  shell.doc.title = page.head.title

  return (
    <Inner>
      {transformNodes(page.body)}
    </Inner>
  )
}

export default withLoader(BlogPost)

function transformNode({tagName, props, children = []}) {
  return h(tagName, props, transformNodes(children))
}

function transformNodes(nodes) {
  return nodes.map((node) => {
    if (typeof node === 'string') {
      return node
    }
    else {
      return transformNode(node)
    }
  })
}

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
