import {h} from 'hyperapp'

import {Link} from './Link'
import {
  TwitterShareLink,
  RedditShareLink,
} from './ShareLink'

export function Post({post, profiles}) {
  const {head, body} = post

  const titleNode = [...body[0]]
  titleNode[1] = {
    ...titleNode[1],
    class: 'Post-title',
  }

  const shareUrl = new URL(window.location).toString()

  return (
    <div class="Post">
      <div class="Post-header">
        {transformNode(titleNode)}
        <div class="Post-subheader">
          <span class="Post-publishAt">
            {toLocaleDate(new Date(head.publishAt))}
          </span>
          <span class="Post-share">
            Share to
            {' '}
            <TwitterShareLink
              url={shareUrl}
              text={head.title}
              via={profiles.twitter}
            />
            {' '}
            <RedditShareLink
              url={shareUrl}
              title={head.title}
            />
          </span>
        </div>
      </div>
      <div class="Post-body">
        {transformNodes(body.slice(1))}
      </div>
    </div>
  )
}

function toLocaleDate(date) {
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
  })
}

function transformNode([tagName, props, children = []]) {
  switch (tagName) {
  case 'a': {
    return hLink(props, children)
  }
  default:
    return h(tagName, props, transformNodes(children))
  }
}

function hLink(props, children) {
  if (props.href && /^(\.|\/|[^:\/]+\/?)/.test(props.href)) {
    return h(Link, props, transformNodes(children))
  }
  else {
    return h('a', props, transformNodes(children))
  }
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
