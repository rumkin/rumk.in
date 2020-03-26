import {h} from 'hyperapp'

export function Post({post}) {
  const {head, body} = post

  const titleNode = {...body[0]}
  titleNode.props = {
    ...titleNode.props,
    class: 'Post-title',
  }

  return (
    <div class="Post">
      <div class="Post-header">
        {transformNode(titleNode)}
        <div class="Post-publishAt">
          {toLocaleDate(new Date(head.publishAt))}
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