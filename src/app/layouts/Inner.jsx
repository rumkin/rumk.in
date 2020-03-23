import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'
import {Link} from '../components/Link'
import Logo from '../components/Logo'

import {Copyright} from './shared/copyright'

export function Inner(props, children) {
  return (
    <div class="App-view container">
      <header class="App-header">
        <div class="PageHead">
          <div class="PageHead-body">
            <h1 class="PageHead-header">
              <Link route="/">
                <Logo class="PageHead-logo" size={16} />
                Paul Rumkin
              </Link>
            </h1>
          </div>
        </div>
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
