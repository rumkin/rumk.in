import {h} from 'hyperapp'

import {Link} from '../components/link'
import {Inner} from '../layouts/Inner'

export default function BlogPost(state, actions) {
  const {status, shell} = state

  shell.doc.title = 'Blog Post'

  return (
    <Inner>
      <h1>
        Blog Page
      </h1>
      <p>
        Status: {status}
      </p>
    </Inner>
  )
}

export async function fetchRemoteState({params}) {
  // return
}
