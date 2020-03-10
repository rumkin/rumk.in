export function resolve(url) {
  switch (url) {
    case '/':
      return {
        route: {
          params: {}
        },
        component: 'mainPage',
      }
    default:
      return {
        route: {
          params: {}
        },
        component: 'notFoundPage',
      }
  }
}
