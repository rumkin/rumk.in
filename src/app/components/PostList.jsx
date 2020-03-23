import {h} from 'hyperapp'

import {groupBy} from '../helpers/data'

import {Link} from './Link'

export function PostList({posts}) {
  const byYear = groupBy((item) => {
    const data = new Date(item.head.publishAt)
    return data.getFullYear()
  }, posts)
  .sort((a, b) => a.key - b.key)

  return (
    <ul class="PostList">
      {byYear.map(({key: year, items}) => {
        return (
          <li class="PostList-group" key={year}>
            <h3 class="PostList-groupTitle">{year}</h3>

            <ul class="PostList-groupItems">
              {items.map(post => (
                <li class="PostList-article" key={post.id}>
                  <Link
                    class="PostList-articleLink"
                    route="/blog/[:postId]"
                    params={{postId: post.id}}
                  >
                    {post.head.title || `Post ${post.id}`}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
