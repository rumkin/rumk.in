import {r} from '../lib/router'

import {
  home,
  blog,
  blogPost,
} from './pages'

export default r({
  '/': home,
  '/blog': r({
    '/': blog,
    '/[pageId]': r({
      '/': blogPost,
    })
  })
})
