import createRouter from '../lib/createRouter'
import pages from './pages'

export default createRouter({
  '/_/404': {
    default() {
      return '404'
    },
  },
  '/_/500': {
    default() {
      return '500'
    },
  },
  ...pages
})
