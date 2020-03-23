import {h} from 'hyperapp'

import {Copyright} from './shared/copyright'

export function Plain(props, children) {
  return (
    <div class="App-view container">
      <main class="App-body">
        {children}
      </main>
      <footer class="App-footer">
        <Copyright />
      </footer>
    </div>
  )
}
