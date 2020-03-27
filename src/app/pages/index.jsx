import {h} from 'hyperapp'

import {Main} from '../layouts/Main'

function Home(state, actions) {
  const {page, shell, globals} = state
  const {doc} = shell

  doc.title = globals.owner

  doc.openGraph('title', globals.owner)
  doc.openGraph('description', 'Personal website')

  return (
    <Main>
      <div class="Projects Main">
      </div>
    </Main>
  )
}

export default Home
