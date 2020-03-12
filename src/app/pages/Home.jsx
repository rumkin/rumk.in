import {h} from 'hyperapp'

import Logo from '../components/Logo'
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

function Loading(state) {
  return <div>Loading...</div>
}

export default function Home(state, actions) {
  actions.setTitle('Paul Rumkin')

  const {url, isLoading, error, page, status} = state

  let content
  if (! page) {
    if (status === 0 && ! isLoading) {
      actions.pageLoad(url)
    }
    else {
      content = <Loading state={state} />
    }
  }
  else if (error) {
    content = <div>Error {error + ''}</div>
  }
  else {
    content = (
      <div class="Projects">
        <h2 class="Projects-header">
          Projects
        </h2>
        <ProjectList projects={page.projects} />
      </div>
    )
  }

  return (
    <Main>
      {content}
    </Main>
  );
};

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
