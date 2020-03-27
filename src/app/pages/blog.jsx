import {h} from 'hyperapp'

import {PostList} from '../components/PostList'
import {withLoader} from '../helpers/loader'
import {Inner} from '../layouts/Inner'

function BlogPostList({status, route, shell, page, globals}) {
  shell.doc.title = `Articles - ${globals.owner}`

  return (
    <Inner>
      <h1 class="PageBody-title">
        Articles
      </h1>
      <PostList posts={page.posts} />
    </Inner>
  )
}

export default withLoader(BlogPostList)

export async function fetchRemoteState(ctx, {blog}) {
  const posts = await blog.listPosts()

  return {
    posts: posts.map((post) => ({
      id: post.id,
      head: post.head,
    })),
  }
}
