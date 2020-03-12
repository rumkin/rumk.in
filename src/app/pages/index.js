export * as home from './Home'
export * as blog from './Blog'
export * as blogPost from './BlogPost'

import * as notFoundPage from './404'
import * as unknownErrorPage from './500'

export const errors = {
  404: notFoundPage,
  500: unknownErrorPage,
}
