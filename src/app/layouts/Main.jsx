import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'
import Logo from '../components/Logo'


import {Copyright} from './shared/copyright'

export function Main(props, children) {
  return (
    <div class="App-view container">
      <header class="App-header">
        <div class="Hero">
          <div class="Hero-body">
            <h1 class="Hero-header">
              <Logo class="Hero-logo" size={32} />
              Paul Rumkin
            </h1>
            <p class="Hero-intro">
              Developer and author
            </p>
          </div>
        </div>
        <ProfileContacts />
      </header>
      <main class="App-body">
        {children}
      </main>
      <footer class="App-footer">
        <Copyright />
      </footer>
    </div>
  )
}


function ProfileContact({icon, size=16, url, compact}, ...children) {
  return (
    <a href={url} class="ProfileContacts-link">
      {h(icon, {size, class: "Icon"})}{compact ? null : [' ', ...children]}
    </a>
  )
}

function ProfileContacts() {
  return (
    <ul class="ProfileContacts">
      <li class="ProfileContacts-item">
        <ProfileContact
          url="mailto:hello@rumk.in"
          icon={MailIcon}
          compact={false}
        >
          hello@rumk.in
        </ProfileContact>
      </li>
      <li class="ProfileContacts-item">
        <ProfileContact
          url="https://github.com/rumkin"
          icon={GithubIcon}
          compact={false}
        >
          rumkin
        </ProfileContact>
      </li>
      <li class="ProfileContacts-item">
        <ProfileContact
          url="https://twitter.com/rumkin"
          icon={TwitterIcon}
          compact={false}
        >
          rumkin
        </ProfileContact>
      </li>
    </ul>
  )
}
