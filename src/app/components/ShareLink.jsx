import {h} from 'hyperapp'

import TwitterIcon from './icons/twitter'
import RedditIcon from './icons/reddit'

export function TwitterShareLink({
  url,
  text,
  via = null,
  size = 16,
}) {
  const shareUrl = new URL('https://twitter.com/share')
  shareUrl.searchParams.set('url', url)
  shareUrl.searchParams.set('text', text)
  return (
    <a class="ShareLink" href={shareUrl} target="_blank" rel="noopener noreferrer">
      <TwitterIcon size={size} class="ShareLink-icon" />
    </a>
  )
}

export function RedditShareLink({
  url,
  title,
  size = 16,
}) {
  const shareUrl = new URL('https://reddit.com/submit')
  shareUrl.searchParams.set('url', url)
  shareUrl.searchParams.set('title', title)
  return (
    <a class="ShareLink" href={shareUrl} target="_blank" rel="noopener noreferrer">
      <RedditIcon size={size} class="ShareLink-icon" />
    </a>
  )
}
