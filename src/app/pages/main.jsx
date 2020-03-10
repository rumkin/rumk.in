import {h} from 'hyperapp'

import {GithubIcon, TwitterIcon, MailIcon} from '../components/icons'

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

function Logo() {
  return (
    <img
      class="Hero-Logo"
      src="/assets/logo.png"
      width={32}
      heigh={32}
      alt="Logo"
    />
  )
};

function ProfileContact({icon, size=16, url, compact}, ...children) {
  return (
    <a href={url} class="ProfileContacts-link">
      {h(icon, {size, class: "Icon"})}{compact ? null : [' ', ...children]}
    </a>
  )
}

function ProfileContacts() {
  return (
    <ul class="ProfileContacts">
      <li class="ProfileContacts-item">
        <ProfileContact
          url="mailto:hello@rumk.in"
          icon={MailIcon}
          compact={false}
        >
          hello@rumk.in
        </ProfileContact>
      </li>
      <li class="ProfileContacts-item">
        <ProfileContact
          url="https://github.com/rumkin"
          icon={GithubIcon}
          compact={false}
        >
          rumkin
        </ProfileContact>
      </li>
      <li class="ProfileContacts-item">
        <ProfileContact
          url="https://twitter.com/rumkin"
          icon={TwitterIcon}
          compact={false}
        >
          rumkin
        </ProfileContact>
      </li>
    </ul>
  )
}

function Loading(state) {
  return <div>Loading...</div>
}

export default function MainPage(state, actions) {
  actions.setTitle('Paul Rumkin')
  
  const {url, isLoading, error, page} = state

  let content
  if (! page) {
    if (! isLoading) {
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
    <div class="container">
      <div class="Hero">
        <div class="Hero-body">
          <h1 class="Hero-header">
            <Logo />
            Paul Rumkin
          </h1>
          <p class="Hero-intro">
            Developer and author
          </p>
        </div>
      </div>
      <ProfileContacts />
      <main class="Main">
        {content}
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
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
