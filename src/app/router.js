export function resolve(url) {
  switch (url) {
    case '/':
      return {
        route: {
          params: {}
        },
        componentId: 'mainPage',
      }
    default:
      return {
        route: {
          params: {}
        },
        componentId: 'notFoundPage',
      }
  }
}
