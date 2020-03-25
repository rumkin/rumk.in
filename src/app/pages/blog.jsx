import {h} from 'hyperapp'

import {PostList} from '../components/PostList'
import {withLoader} from '../helpers/loader'
import {Inner} from '../layouts/Inner'

function BlogPostList({status, route, shell, page}) {
  shell.doc.title = 'Articles'

  return (
    <Inner>
      <h1>
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