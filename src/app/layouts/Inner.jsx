import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'
import {Link} from '../components/Link'
import {MainMenu} from '../components/MainMenu'
import {Logo} from '../components/Logo'

import {Copyright} from './shared/copyright'

export function Inner(props, children) {
  return (
    <InnerWide>
      <div class="container">
        {children}
      </div>
    </InnerWide>
  )
}

export function InnerWide(props, children) {
  return (
    <div class="App-view">
      <header class="App-header Inner-header">
        <div class="PageHead container">
          <div class="PageHead-row">
            <div class="PageHead-header">
              <Link route="/">
                <Logo variant="small" class="PageHead-logo" size={16} />
                Paul Rumkin
              </Link>
            </div>
            <div class="PageHead-menu">
              <MainMenu />
            </div>
          </div>
        </div>
      </header>
      <main class="App-body">
        {children}
      </main>
      <footer class="App-footer">
        <div class="container">
          <Copyright />
        </div>
      </footer>
    </div>
  )
}
