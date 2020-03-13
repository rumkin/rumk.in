export class Shell {
  constructor({
    doc,
    url,
    hasViewport = true,
    isStatic = false,
  }) {
    this.doc = doc
    this._url = url
    this._hasViewport = hasViewport
    this._isStatic = isStatic
  }

  get hasViewport() {
    return this._hasViewport
  }

  get url() {
    return this._url
  }

  navigate(url) {
    if (this.isStatic) {
      throw new Error('Couldn\'t navigate in static mode')
    }

    this._url = url

    return url
  }

  fetch(url, opts) {
    return fetch(url, opts)
  }
}
