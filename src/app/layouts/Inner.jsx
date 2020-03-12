import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'
import {Link} from '../components/Link'
import Logo from '../components/Logo'

export function Inner(props, children) {
  return (
    <div class="container">
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
      <main class="Main">
        {children}
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
  )
}
