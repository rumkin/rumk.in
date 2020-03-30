import {h} from 'hyperapp'

import {Main} from '../layouts/Main'
import {ProjectList} from '../components/ProjectList'
import {ShowcaseHeader} from '../components/Showcase/Header'

const projects = {}

function Home(state, actions) {
  const {page, shell, globals} = state
  const {doc} = shell

  doc.title = globals.owner

  doc.openGraph('title', globals.owner)
  doc.openGraph('description', 'Personal website')

  return (
    <Main>
      <div class="box">
        <ShowcaseHeader
          title="Apps"
          subtitle="Applications and utils"
        />
        <ProjectList projects={projects.apps} />
      </div>
      <div class="box">
        <ShowcaseHeader
          title="JavaScript"
          subtitle="Packages for node.js and web"
        />
        <ProjectList projects={projects.node} />
      </div>
      <div class="box">
        <ShowcaseHeader
          title="Ethereum"
          subtitle="Solidity contracts and code libraries"
        />
        <ProjectList projects={projects.ethereum} />
      </div>
    </Main>
  )
}

export default Home

projects.apps = [
  {
    name: 'Code to Image',
    description: 'Convert source code into image for shareing in social networks',
    kind: 'webapp',
    links: [
      {
        url: 'https://code-to-image.now.sh',
        text: 'Website',
      },
    ],
  },
]

projects.node = [
  {
    name: 'Plant',
    description: 'HTTP2 web server for Node.js and Browser',
    kind: 'library',
    links: [
      {
        url: 'https://github.com/rumkin/plant',
        text: 'Github',
      },
      {
        url: 'https://npmjs.com/package/@plant/plant',
        text: 'NPM',
      },
    ],
  },
  {
    name: 'TestUp',
    kind: 'util',
    description: 'Test running tool for Node.js and browsers',
    links: [
      {
        url: 'https://github.com/rumkin/testup',
        text: 'Github',
      },
      {
        url: 'https://npmjs.com/package/testup',
        text: 'NPM',
      },
    ],
  },
  {
    name: 'Typed-Props',
    kind: 'library',
    description: 'Values validation with React interface',
    links: [
      {
        url: 'https://github.com/rumkin/typed-props',
        text: 'Github',
      },
      {
        url: 'https://npmjs.com/package/typed-props',
        text: 'NPM',
      },
    ]
  },
]

projects.ethereum = [
  {
    name: 'Lib',
    description: 'Library for solidity',
    kind: 'library',
    links: [
      {
        url: 'https://github.com/rumkin/ethereum-lib',
        text: 'Github',
      },
    ],
  }
]
