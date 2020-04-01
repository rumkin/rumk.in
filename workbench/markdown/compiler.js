import unified from 'unified'
import sanitize from 'hast-util-sanitize'
import toHyper from 'hast-to-hyperscript'
import refractor from 'refractor'
import katex from 'rehype-katex'
import frontmatter from 'remark-frontmatter'
import math from 'remark-math'
import remark from 'remark-parse'
import toRehype from 'remark-rehype'
import hastToString from 'hast-util-to-string'
import visitAst from 'unist-util-visit'
import yaml from 'js-yaml'
import Vfile from 'vfile'

export default class Compiler {
  async compile(source, {filename = ''} = {}) {
    const processor = unified()
      .use(remark)
      .use(math)
      .use(frontmatter)
      .use(highlighter)
      .use(toRehype)
      .use(katex)
      .use(styleToObject)
      .use(sanitize)

    const tree = await processor.parse(new Vfile({
      path: filename,
      contents: source,
    }))

    let hast = await processor.run(tree)
    hast.children = hast.children.filter(({type}) => type === 'element')

    function h(tagName, attrs, children = []) {
      let props = {}
      if (attrs) {
        props = {...attrs}
        if ('class' in attrs) {
          props.className = props.class
          delete props.class
        }
      }

      return [tagName, props, children]
    }

    let head
    const errors = []
    if (tree.children.length && tree.children[0].type === 'yaml') {
      try {
        head = yaml.safeLoad(tree.children[0].value, {filename})
      }
      catch (error) {
        errors.push({
          type: 'error',
          code: 'yaml',
          filename,
          message: 'YAML parsing error: \n' + error.message,
          error,
        })
      }
    }
    else {
      head = {}
    }

    if (! head.title) {
      head.title = getTitle(hast)
    }

    if (! head.description) {
      head.description = getDescription(hast)
    }

    const body = toHyper(h, hast)[2]

    return {
      errors,
      output: {
        head,
        body,
      },
    }
  }
}

function getTitle(hast) {
  const node = hast.children.find((node) => node.tagName === 'h1')

  if (node) {
    return hastToString(node)
  }
}

function getDescription(hast) {
  const node = hast.children.slice(0, 3)
  .find((node) => {
    return node.tagName === 'p'
  })

  if (node) {
    return hastToString(node)
  }
}

function highlighter() {
  return (ast) => visitAst(ast, 'code', visitor)

  function visitor(node) {
    let {lang, data} = node

    if (! lang) {
      return
    }

    if (! data) {
      data = {}
      node.data = data
    }

    if (! data.hProperties) {
      data.hProperties = {}
    }

    data.hChildren = refractor.highlight(node.value, lang)
    data.hProperties.className = `language-${lang}`
  }
}

function styleToObject() {
  return (ast) => visitAst(ast, visitor)

  function visitor(node) {
    const {properties} = node

    if (! properties || typeof properties.style !== 'string') {
      return
    }

    properties.style = toObject(properties.style)
  }

  function toObject(style) {
    return style.replace(/;$/, '')
    .split(';')
    .map(value => value.split(':'))
    .reduce((result, [prop, value]) => {
      result[prop.trim()] = value.trim()
      return result
    }, {})
  }
}
