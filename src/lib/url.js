export function normalizeBaseUrl(url) {
  url.pathname = addTrailingSlash(url.pathname)
  return url
}

export function addTrailingSlash(pathname) {
  if (/\/[^.\/]+$/.test(pathname)) {
    return pathname + '/'
  }
  else {
    return pathname
  }
}
