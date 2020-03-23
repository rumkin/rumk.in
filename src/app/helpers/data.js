
export function groupBy(prop, list) {
  if (typeof prop === 'function') {
    return groupByFunc(prop, list)
  }
  else {
    return groupByName(prop, list)
  }
}

export function groupByFunc(prop, list) {
  const index = new Map()
  const result = []
  for (const item of list) {
    const key = prop(item)
    if (! index.has(key)) {
      const items = [
        item
      ]
      result.push({
        key,
        items,
      })
      index.set(key, items)
    }
    else {
      index.get(key).push(item)
    }
  }
  return result
}

export function groupByName(prop, list) {
  const index = new Map()
  const result = []
  for (const item of list) {
    const key = item[prop]
    if (! index.has(key)) {
      const items = [
        item
      ]
      result.push({
        key,
        items,
      })
      index.set(key, items)
    }
    else {
      index.get(key).push(item)
    }
  }
  return result
}
