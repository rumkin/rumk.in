import {h} from 'hyperapp'

import {Link} from './Link'

export function Menu({
  items,
  className,
  itemClassName,
  activeItemClassName,
  activeKeys = [],
}) {
  return (
    <nav class={className}>
      {items.map(({route, params = {}, label, key = i}, i) => (
        <Link
          key={key}
          route={route}
          params={params}
          class={itemClassName + (activeKeys.includes(key) ? (' ' + activeItemClassName) : (''))}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
