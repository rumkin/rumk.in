import fs from 'fs'
import path from 'path'

import babel from '@babel/core'

import iterateDir from '../utils/iterateDir'

export default function removeExport({
  dir = '.',
  functions = [],
  classes = [],
  variables = [],
  babelConfig = {}
}) {
  const resolvedIds = new Map();

  const modules = []
  for (const {stat, filepath} of iterateDir(dir)) {
    if (stat.isFile() && (filepath.endsWith('.js') || filepath.endsWith('.jsx'))) {
      modules.push(filepath)
      const content = replaceExports(
        fs.readFileSync(filepath, 'utf8'),
        {functions, classes, variables},
        babelConfig,
      )
      resolvedIds.set(path.resolve(filepath), content)
    }
  }

  return {
    name: 'removeExport',

    resolveId(id, importer) {
      if (id in modules) return id;

      if (importer) {
        for (const search of normalize(id)) {
          const resolved = path.resolve(path.dirname(importer), search)
          if (resolvedIds.has(resolved)) {
            return resolved;
          }
        }
      }
    },

    load(id) {
			if (id in modules) {
				return modules[id]
			}
			else if (resolvedIds.has(id)) {
				return resolvedIds.get(id)
			}
    }
  };
}

function normalize(id) {
  if (id.endsWith('.js')) {
    return [id]
  }
  else {
    return [
      `${id}.js`,
      `${id}.jsx`,
      `${id}/index.js`,
      `${id}/index.jsx`,
    ]
  }
}

function replaceExports(content, {functions, classes, variables}, babelConfig) {
  return replaceExportNodes(content, (node) => {
    if (! node.declaration) {
      return
    }

    switch (node.declaration.type) {
      case 'FunctionDeclaration': {
        for (const [name, placeholder] of functions) {
          if (name === node.declaration.id.name) {
            return [node, placeholder]
          }
        }

        return
      }
      case 'VariableDeclaration': {
        for (const [name, placeholder] of variables) {
          for (const declaration of node.declaration.declarations) {
            if (name === declaration.id.value) {
              return [node, placeholder]
            }
          }
        }

        return
      }
      case 'ClassDeclaration': {
        for (const [name, placeholder] of classes) {
          if (name === node.declaration.id.value) {
            return [node, placeholder]
          }
        }

        return
      }
      default:
        return
    }
  }, babelConfig)
}

function replaceExportNodes(content, matcher, babelConfig) {
  const ast = babel.parse(content, babelConfig)
  const nodes = []

  babel.traverse(ast, {
    ExportNamedDeclaration({node}) {
      const match = matcher(node)
      if (match) {
        nodes.push(match)
      }
    },
  })

  if (nodes.length) {
    return replaceNodesContent(content, nodes)
  }
  else {
    return content
  }
}

function replaceNodesContent(content, nodes) {
  for (let [node, placeholder] of nodes) {
    if (! placeholder) {
      placeholder = '\n'.repeat(1 + node.loc.end.line - node.loc.start.line)
    }
    else if (typeof placeholder === 'function') {
      placeholder = placeholder(node)
    }

    content = content.slice(0, node.start) + placeholder + content.slice(node.end)
  }

  return content
}
