import unified from 'unified'
import remark from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import toRehype from 'remark-rehype'
import sanitize from 'hast-util-sanitize'
import Vfile from 'vfile'
import toHyper from 'hast-to-hyperscript'
import yaml from 'js-yaml'

export default class Compiler {
  async compile(source, {filename = ''} = {}) {
    const processor = unified()
      .use(remark)
      .use(frontmatter)
      .use(toRehype)
      .use(sanitize)

    const tree = await processor.parse(new Vfile({
      path: filename,
      contents: source,
    }))

    const hast = await processor.run(tree)

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
          message: 'YAML parsing error',
          error,
        })
      }
    }
    else {
      head = {}
    }

    const body = toHyper(h, hast).children

    console.log({body, head})
    return {
      errors,
      output: {
        head,
        body,
      },
    }
  }
}
