import {h} from 'hyperapp'

import {Link} from '../../components/Link'
import {withLoader} from '../../helpers/loader'
import {Inner} from '../../layouts/Inner'

function BlogPostList({status, route, shell, page}) {
  shell.doc.title = `Blog page #${route.params.page}`

  return (
    <Inner>
      <h1>
        Posts on page #{route.params.page}
      </h1>
      <div>
        <p>
          Posts lists:
        </p>
        <ul>
          {page.posts.map(post => (
            <li key={post.id}>
              <Link route="/blog/[:postId]" params={{postId: post.id}}>
                {post.head.title || `Post ${post.id}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Inner>
  )
}

export default withLoader(BlogPostList)

export async function fetchRemoteState({route}, {blog}) {
  const page = route.params.page - 1
  const posts = await blog.listPosts({
    offset: page * 10,
    limit: 10,
  })

  return {
    posts: posts.map((post) => ({
      id: post.id,
      head: post.head,
    })),
  }
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
