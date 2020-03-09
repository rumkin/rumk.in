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
    if (stat.isFile() && filepath.endsWith('.js')) {
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
          const resolved = path.resolve(path.dirname(importer), search);
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
      `${id}/index.js`,
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
        for (const name of functions) {
          if (name === node.declaration.id.name) {
            return true
          }
        }

        return false
      }
      case 'VariableDeclaration': {
        for (const name of variables) {
          for (const declaration of node.declaration.declarationss) {
            if (name === declaration.id.value) {
              return true
            }
          }
        }

        return false
      }
      case 'ClassDeclaration': {
        for (const name of classes) {
          if (name === node.declaration.id.value) {
            return true
          }
        }

        return false
      }
      default:
        return false
    }
  }, babelConfig)
}

function replaceExportNodes(content, filter, babelConfig) {
  const ast = babel.parse(content, babelConfig)
  const nodes = []

  babel.traverse(ast, {
    ExportNamedDeclaration({node}) {
      if (filter(node) === true) {
        nodes.push(node)
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
  for (const node of nodes) {
    content = content.slice(0, node.start) + '\n'.repeat(1 + node.loc.end.line - node.loc.start.line) + content.slice(node.end)
  }

  return content
}
