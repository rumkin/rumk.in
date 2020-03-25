import {h} from 'hyperapp'

import {Main} from '../layouts/Main'

function Home(state, actions) {
  const {page, shell} = state
  const {doc} = shell

  doc.title = 'Paul Rumkin'

  doc.openGraph('title', 'Paul Rumkin')
  doc.openGraph('description', 'Personal website')

  return (
    <Main>
      <div class="Projects Main">
      </div>
    </Main>
  )
}

export default Home
