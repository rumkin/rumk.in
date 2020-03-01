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
      class="logo"
      src="/assets/logo.png"
      width={16}
      heigh={16}
      alt="Logo"
    />
  )
};

export default function MainPage(state, actions) {
  actions.setTitle('Paul Rumkin');

  return (
    <div class="container">
      <div class="Hero">
        <div class="Hero-body">
          <h1 class="Hero-header">
            <Logo />
            Paul Rumkin
          </h1>
          <p>
            Developer and author.
          </p>
          <nav class="Profile-nav">
            <a href="mailto:dev@rumk.in">
              <MailIcon size={16} class="Icon" /> dev@rumk.in
            </a>{' '}
            <a href="https://github.com/rumkin">
              <GithubIcon size={16} class="Icon" /> rumkin
            </a>{' '}
            <a href="https://twitter.com/rumkin">
              <TwitterIcon size={16} class="Icon" /> rumkin
            </a>
          </nav>
        </div>
      </div>
      <main class="Main">
        <div class="Projects">
          <h2 class="Projects-header">
            Projects
          </h2>
          <ProjectList projects={state.projects} />
        </div>
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
  );
};
