import {h} from 'hyperapp'

import {Menu} from './Menu'

export function MainMenu() {
  return (
    <Menu
      className="MainMenu"
      itemClassName="MainMenu-link"
      activeItemClassName="MainMenu-link--active"
      activeKeys={[]}
      items={[
        {key: 'blog', route: '/blog', label: 'Blog'},
        {key: 'contacts', route: '/contacts', label: 'Contacts'},
      ]}
    />
  )
}
