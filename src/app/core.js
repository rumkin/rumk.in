export function resolve(url, router, pages) {
  const {route, component} = router.resolve(url)

  if (component) {
    return{
      status: 0,
      route,
      component,
    }
  }
  else {
    return {
      status: 404,
      route: {},
      component: pages.notFoundPage,
    }
  }
}
