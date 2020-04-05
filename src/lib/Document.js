export class AbstractVirtualDocument {
  set title(_) {
    throw new Error('Not implemented yet')
  }

  get title() {
    throw new Error('Not implemented yet')
  }

  metaProp() {
    throw new Error('Not implemented yet')
  }

  meta() {
    throw new Error('Not implemented yet')
  }

  set baseURI(value) {
    throw new Error('Not implemented yet')
  }

  get baseURI() {
    throw new Error('Not implemented yet')
  }

  addStyle() {
    throw new Error('Not implemented yet')
  }

  removeStyle() {
    throw new Error('Not implemented yet')
  }

  get styles() {
    throw new Error('Not implemented yet')
  }

  addScript() {
    throw new Error('Not implemented yet')
  }

  removeScript() {
    throw new Error('Not implemented yet')
  }

  get scripts() {
    throw new Error('Not implemented yet')
  }
}

export class StaticDocument extends AbstractVirtualDocument {
  constructor({
    title = '',
    lang = 'en',
    metatags = {},
    styles = [],
    scripts = [],
  } = {}) {
    super()

    this._title = title
    this._lang = lang
    this._metatags = new Map(Object.entries(metatags))
    this._baseURI = '/'

    this._styles = new Map()
    styles.forEach((style) => this.addStyle(style))

    this._scripts = new Map()
    scripts.forEach((script) => this.addScript(script))
  }

  set title(value) {
    this._title = value + ''
  }

  get title() {
    return this._title
  }

  set lang(value) {
    this._lang = value + ''
  }

  get lang() {
    return this._lang
  }

  get metatags() {
    return new Map(this._metatags.entries())
  }

  openGraph(name, content) {
    return this.metaProp(`og:${name}`, content)
  }

  metaProp(name, content) {
    return this.metatag('property', name, content)
  }

  meta(name, content) {
    return this.metatag('name', name, content)
  }

  metatag(attr, value, content) {
    const key = `${attr}:${value}`

    if (content !== void 0) {
      this._metatags.set(key, {
        [attr]: value,
        content,
      })
    }
    else {
      this._metatags.delete(key)
    }

    return this
  }

  set baseURI(value) {
    this._baseURI = value
  }

  get baseURI() {
    return this._baseURI
  }

  addStyle(style) {
    this._addElement(
      this._styles,
      this._normalizeElement(style),
    )

    return this
  }

  removeStyle(style) {
    this._removeElement(
      this._styles,
      this._normalizeElement(style),
    )
    return this
  }

  get styles() {
    return new Map(this._styles.entries())
  }

  addScript(script) {
    this._addElement(
      this._scripts,
      this._normalizeElement(script),
    )
    return this
  }

  removeScript(script) {
    this._removeElement(
      this._scripts,
      this._normalizeElement(script),
    )
    return this
  }

  get scripts() {
    return new Map(this._scripts.entries())
  }

  _addElement(elements, element) {
    const {id} = element

    if (elements.has(id)) {
      const origin = elements.get(id)
      const [key, value] = getMismatch(origin, element)
      if (key) {
        throw new Error(`Value doesn't match existing: "${key}" is "${value}"`)
      }
    }
    else {
      elements.set(id, element)
    }
  }

  _removeElement(elements, element) {
    const {id} = element

    if (elements.has(id)) {
      elements.delete(id)
    }
  }

  _normalizeElement(element) {
    if (! element.id) {
      if (! element.url) {
        throw new Error('No id or url property specified')
      }

      return {
        id: element.url + '',
        ...element,
      }
    }
    else {
      return element
    }
  }
}

export class DynamicDocument extends AbstractVirtualDocument {
  constructor(document, props) {
    super()

    this._document = document

    this._styles = collectStyles(document.head)
    this._scripts = collectScripts(document.body)
  }

  set title(value) {
    this._document.title = value
  }

  get title() {
    return this._document.title
  }

  openGraph(name, value) {
    return this.metaProp(`og:${name}`, value)
  }

  metaProp(name, content) {
    return this.metatag('property', name, content)
  }

  meta(name, content) {
    return this.metatag('name', name, content)
  }

  metatag(attr, name, content) {
    const doc = this._document

    let tag = doc.head.querySelector(`meta[${attr}='${escapeCssString(name)}']`)
    if (content !== void 0) {
      if (! tag) {
        tag = doc.createElement('meta')
        tag.setAttribute(attr, name)
        tag.setAttribute('content', content)
        doc.head.appendChild(tag)
      }
    }
    else if (tag) {
      tag.remove()
    }
  }

  set baseURI(value) {
    const doc = this._document
    if (value !== undefined) {
      let base = doc.head.querySelector('base')
      if (! base) {
        base = doc.createElement('base')
        doc.appendChild(base)
      }

      base.href = value
    }
    else {
      let base = doc.head.querySelector('base')
      if (base) {
        base.remove()
      }
    }
  }

  get baseURI() {
    return this._document.baseURI
  }

  addStyle(style) {
    this._addStyleElement(
      this._styles,
      this._normalizeElement(style),
    )
    return this
  }

  removeStyle(style) {
    this._removeElement(
      this._styles,
      this._normalizeElement(style),
    )
    return this
  }

  get styles() {
    return new Map(this._styles.entries())
  }

  addScript(script) {
    this._addScriptElement(
      this._scripts,
      this._normalizeElement(script),
    )

    return this
  }

  removeScript(script) {
    this._removeElement(
      this._scripts,
      this._normalizeElement(script),
    )
    return this
  }

  get scripts() {
    return new Map(this._scripts.entries())
  }

  _addStyleElement(elements, element) {
    const {id} = element

    if (elements.has(id)) {
      const origin = elements.get(id)
      const [key, value] = getMismatch(origin, element)
      if (key) {
        throw new Error(`Value doesn't match existing: "${key}" is "${value}"`)
      }
    }
    else {
      elements.set(id, element)
      const node = this._createStyleElement(element)
      this._document.head.appendChild(node)
    }
  }

  _createStyleElement(element) {
    if (element.url) {
      const el = this._document.createElement('link')

      el.setAttribute('id', element.id)
      el.setAttribute('rel', 'stylesheet')
      el.setAttribute('href', element.url)
      if (element.crossOrigin) {
        el.setAttribute('crossorigin', element.crossOrigin)
      }
      if (element.integrity) {
        el.setAttribute('integrity', element.integrity)
      }

      return el
    }
    else {
      const el = this._document.createElement('style')

      el.setAttribute('id', element.id)
      el.textContent = element.content

      return el
    }
  }

  _addScriptElement(elements, element) {
    const {id} = element

    if (elements.has(id)) {
      const origin = elements.get(id)
      const [key, value] = getMismatch(origin, element)
      if (key) {
        throw new Error(`Value doesn't match existing: "${key}" is "${value}"`)
      }
    }
    else {
      elements.set(id, element)
      const node = this._createScriptElement(element)
      this._document.body.appendChild(node)
    }
  }

  _createScriptElement(element) {
    if (element.url) {
      const el = this._document.createElement('script')

      el.setAttribute('id', element.id)
      if (element.type) {
        el.setAttribute('type', element.type)
      }
      el.setAttribute('src', element.url)
      if (element.crossOrigin) {
        el.setAttribute('crossorigin', element.crossOrigin)
      }
      if (element.integrity) {
        el.setAttribute('integrity', element.integrity)
      }

      return el
    }
    else {
      const el = this._document.createElement('script')

      el.setAttribute('id', element.id)
      if (element.type) {
        el.setAttribute('type', element.type)
      }
      el.textContent = element.content

      return el
    }
  }

  _removeElement(elements, element) {
    const {id} = element

    if (elements.has(id)) {
      elements.delete(id)
      this._document.getElementById(element.id).remove()
    }
  }

  _normalizeElement(element) {
    if (! element.id) {
      if (! element.url) {
        throw new Error('No id or url property specified')
      }

      return {
        id: element.url + '',
        ...element,
      }
    }
    else {
      return element
    }
  }
}

function escapeCssString(str) {
  return str.replace(/\\/g, '\\\\')
  .replace(/'/g, '\\\'')
}

function getMismatch(source, target) {
  const keys = Object.keys(source)
  for (const k of keys) {
    if (! target.hasOwnProperty(k)) {
      return [k]
    }
    else if (target[k] !== source[k]) {
      return [k, target[k]]
    }
  }

  for (const k of Object.keys(target)) {
    if (! keys.includes(k)) {
      return [k, target[k]]
    }
  }

  return []
}

function collectStyles(node) {
  return new Map([
    ...collectStyleNodes(node),
    ...collectStyleLinks(node)
  ])
}

function collectStyleNodes(node) {
  const result = new Map()
  const elements = node.querySelectorAll('style')

  for (const el of elements) {
    const style = {}
    style.id = element.id
    style.content = element.textContent
    result.set(style.id, style)
  }

  return result
}

function collectStyleLinks(node) {
  const result = new Map()
  const elements = node.querySelectorAll('link[rel=stylesheet]')

  for (const element of elements) {
    const style = {}
    style.id = element.id
    style.url = element.href
    if (element.integrity) {
      style.integrity = element.integrity
    }
    if (element.crossOrigin) {
      style.crossOrigin = element.crossOrigin
    }
    result.set(style.id, style)
  }

  return result
}

function collectScripts(node) {
  const result = new Map()
  const elements = node.querySelectorAll('script')

  for (const element of elements) {
    const script = {}
    script.id = element.id || element.getAttribute('src')
    script.url = element.getAttribute('src')

    if (element.hasAttribute('type')) {
      script.type = element.getAttribute('type')
    }

    if (element.hasAttribute('integrity')) {
      script.integrity = element.getAttribute('integrity')
    }

    if (! element.hasAttribute('src')) {
      script.content = element.textContent
    }

    result.set(script.id, script)
  }

  return result
}
