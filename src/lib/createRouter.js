import {Router} from './router'

export default function createRouter(structure) {
  const normalized = normalizeStructure(structure)

  const tree = flattenTree(structureIntoTree(normalized))

  return routerFromTree(tree)
}

function structureIntoTree(normalized) {
  const root = {routes:{}}

  for (const item of normalized) {
    const route = item.route
    let parent = root
    for (let i = 0; i < route.length - 1; i++) {
      const id = route[i]

      if (id in parent.routes === false) {
        parent.routes[id] = {routes: {}}
      }
      parent = parent.routes[id]
    }

    parent.routes[item.route[item.route.length - 1]] = item.component
  }

  return root.routes
}

function flattenTree(tree) {
  const newTree = {}
  for (const [k, v] of Object.entries(tree)) {
    if ('routes' in v) {
      const keys = Object.keys(v.routes)
      if (keys.length === 1 && keys[0] === '/') {
        newTree[k] = v.routes['/']
      }
      else {
        newTree[k] = {routes: flattenTree(v.routes)}
      }
    }
    else {
      newTree[k] = v
    }
  }

  return newTree
}

function routerFromTree(tree) {
  const nextTree = {}
  for (const [k, v] of Object.entries(tree)) {
    if ('routes' in v) {
      nextTree[k] = routerFromTree(v.routes)
    }
    else {
      nextTree[k] = v
    }
  }

  return new Router(nextTree)
}

function normalizeStructure(structure) {
  const result = []

  for (const [filepath, component] of Object.entries(structure)) {
    const basename = pathBasename(filepath)
    const ext = pathExtname(filepath)
    const indexFile = `index${ext}`

    let route = filepath
    if (basename !== indexFile) {
      route = `${route.slice(0, -ext.length)}/${indexFile}`
    }

    route = route.slice(1).split('/').map((p) => {
      if (p === indexFile) {
        return '/'
      }
      else {
        return '/' + p
      }
    })

    result.push({
      route,
      pattern: route.join(''),
      filepath,
      component,
    })
  }

  return result.sort((a, b) => a.pattern.localeCompare(b.pattern))
}

function pathBasename(file) {
  const i = file.lastIndexOf('/')
  return i > -1 ? file.slice(i + 1) : file
}

function pathExtname(file) {
  const i = file.lastIndexOf('.')
  return i > -1 ? file.slice(i) : file
}
