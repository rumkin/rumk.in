import unified from 'unified'
import remark from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import sanitize from 'hast-util-sanitize'
import Vfile from 'vfile'
import toHyper from 'hast-to-hyperscript'
import toRehype from 'remark-rehype'
import hastToString from 'hast-util-to-string'
import visitAst from 'unist-util-visit'
import yaml from 'js-yaml'
import refractor from 'refractor'

export default class Compiler {
  async compile(source, {filename = ''} = {}) {
    const processor = unified()
      .use(remark)
      .use(frontmatter)
      .use(highlighter)
      .use(toRehype)
      .use(sanitize)

    const tree = await processor.parse(new Vfile({
      path: filename,
      contents: source,
    }))

    let hast = await processor.run(tree)
    hast.children = hast.children.filter(({type}) => type === 'element')

    function h(tagName, attrs, children) {
      let props
      if (attrs) {
        props = {...attrs}
        if ('class' in attrs) {
          props.className = props.class
          delete props.class
        }
      }

      return {tagName, props, children}
    }

    // TODO parse yaml
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

    const body = toHyper(h, hast).children

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
