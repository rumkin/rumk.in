import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'
import {Logo} from '../components/Logo'
import {MainMenu} from '../components/MainMenu'

import {Copyright} from './shared/copyright'

export function Main(props, children) {
  return (
    <div class="App-view">
      <header class="App-header">
        <div class="container">
          <div class="MainNavBar">
            <MainMenu />
          </div>
          <div class="Hero">
            <div class="Hero-body">
              <div>
                <Logo class="Hero-logo" size={96} />
              </div>
              <div>
                <h1 class="Hero-header">
                  Paul Rumkin
                </h1>
                <p class="Hero-intro">
                  Developer and author
                </p>
              </div>
            </div>
          </div>
          <ProfileContacts />
        </div>
      </header>
      <main class="App-body">
        <div class="container">
          {children}
        </div>
      </main>
      <footer class="App-footer">
        <div class="container">
          <Copyright />
        </div>
      </footer>
    </div>
  )
}

function ProfileContact({
  icon,
  size = 16,
  url,
  compact,
}, ...children) {
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
