import {h} from 'hyperapp'

import {Inner} from '../layouts/Inner'

export default function Contacts({status, route, shell, page, globals}) {
  shell.doc.title = `Contacts - ${globals.owner}`

  return (
    <Inner>
      <h1 class="PageBody-title">
        Contacts
      </h1>
      <dl>
        <dt>
          Email
        </dt>
        <dd>
          <a href="mailto:hello@rumk.in">
            hello@rumk.in
          </a>
        </dd>
      </dl>
      <dl>
        <dt>
          Github
        </dt>
        <dd>
          <a href="https://github.com/rumkin">
            rumkin
          </a>
        </dd>
      </dl>
      <dl>
        <dt>
          Twitter
        </dt>
        <dd>
          <a href="https://twitter.com/rumkin">
            rumkin
          </a>
        </dd>
      </dl>
    </Inner>
  )
}
