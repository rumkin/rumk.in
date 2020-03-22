export class AbstractVirtualDocument {
  set title(_) {
    throw new Error('Not implemented yet')
  }

  get title() {
    throw new Error('Not implemented yet')
  }

  // TODO Add setIcon method

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
}

export class StaticDocument extends AbstractVirtualDocument {
  constructor({
    title = '',
    lang = 'en',
    metatags = {}
  } = {}) {
    super()

    this._title = title
    this._lang = lang
    this._metatags = new Map(Object.entries(metatags))
    this._baseURI = '/'
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
}

export class DynamicDocument extends AbstractVirtualDocument {
  constructor(document, props) {
    super()

    this._document = document
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
}

function escapeCssString(str) {
  return str.replace(/\\/g, '\\\\')
  .replace(/'/g, '\\\'')
}
