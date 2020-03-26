import {h} from 'hyperapp'

import {groupBy} from '../helpers/data'

import {Link} from './Link'

export function PostList({posts}) {
  let items = posts.map(({id, head}) => {
    return {
      id,
      ...head,
      publishAt: new Date(head.publishAt),
    }
  })

  const byYear = groupBy(({publishAt}) => publishAt.getFullYear(), items)
  .sort((a, b) => a.key - b.key)

  return (
    <ul class="PostList">
      {byYear.map(({key: year, items}) => {
        return (
          <li
            class="PostList-item"
            key={year}
          >
            <h3 class="PostList/Group-title">{year}</h3>
            <ul class="PostList/Group-items">
              {items.map(post => (
                <li class="PostList/Group-item" key={post.id}>
                  <PostListArticle post={post} />
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function PostListArticle({post}) {
  return (
    <div class="PostList/Article">
      <Link
        class="PostList/Article-link"
        route="/blog/[:postId]"
        params={{postId: post.id}}
      >
        {post.title || `Post ${post.id}`}
      </Link>
      {' '}
      <span class="PostList/Article-publishAt">
        {post.publishAt.toLocaleString('en-US', {month: 'long'})} {post.publishAt.getDate()}
      </span>
    </div>
  )
}
