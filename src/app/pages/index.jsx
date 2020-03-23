import {h} from 'hyperapp'

import Logo from '../components/Logo'
import {withLoader} from '../helpers/loader'
import {Main} from '../layouts/Main'

function Props(title, children) {
  return (
    <dl class="projectProps">
      <dt class="projectProps-key">{title}</dt>
      <dd class="projectProps-value">{children}</dd>
    </dl>
  )
}

function ProjectList({projects, ...props}) {
  return (
    <ul class="ProjectList" {...props}>
      {projects.map((project, i) => (
        <li key={i} class="ProjectList-item">
          <a
            class="ProjectList-itemLink"
            href={project.homepage.url}
            title={project.homepage.label}
          >
            <h3>
              {project.title}
            </h3>
            <p class="ProjectList-desc">
              {project.intro}
            </p>
          </a>
        </li>
      ))}
    </ul>
  )
}

function Home(state, actions) {
  const {page, shell} = state
  const {doc} = shell

  doc.title = 'Paul Rumkin'

  doc.openGraph('title', 'Paul Rumkin')
  doc.openGraph('description', 'Personal website')

  return (
    <Main>
      <div class="Projects Main">
        <h2 class="Projects-header">
          Projects
        </h2>
        <ProjectList projects={page.projects} />
      </div>
    </Main>
  )
}

export default withLoader(Home)

export async function fetchRemoteState() {
  return {
    projects: [
      {
        title: 'Plant',
        intro: 'JavaScript HTTP2 web server charged with Web API for Node.js and browsers.',
        homepage: {
          url: 'https://github.com/rumkin/plant',
          label: 'github',
        },
      },
    ],
  }
}
