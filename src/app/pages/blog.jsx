import {h} from 'hyperapp'

import {PostList} from '../components/PostList'
import {withLoader} from '../helpers/loader'
import {withLayout} from '../helpers/layout'
import {Inner} from '../layouts/Inner'

function BlogPostList({shell, page, globals}) {
  shell.doc.title = `Articles - ${globals.owner}`

  return (
    <div class="Page/Body">
      <h1 class="PageBody-title">
        Articles
      </h1>
      <PostList posts={page.posts} />
    </div>
  )
}

export default withLayout(Inner, withLoader(BlogPostList))

export async function fetchRemoteState(ctx, {blog}) {
  const posts = await blog.listPosts()

  return {
    posts: posts.map((post) => ({
      id: post.id,
      head: post.head,
    })),
  }
}
