import {h} from 'hyperapp'

export function ProjectList({projects}) {
  return (
    <ul class="ProjectList">
      {projects.map((project, i) => (
        <li key={i} class="ProjectList-item">
          <ProjectListCard project={project} />
        </li>
      ))}
    </ul>
  )
}

export function ProjectListCard({project}) {
  return (
    <div class="ProjectList/Card">
      <div>
        <h3 class="ProjectList/Card-title">{project.name}</h3>
        {project.kind ? (
          <div class="ProjectList/Card-subtitle">{project.kind}</div>
        ) : null}
        <p class="ProjectList/Card-description">{project.description}</p>
      </div>
      <ProjectListCardLinks links={project.links} />
    </div>
  )
}

export function ProjectListCardLinks({links}) {
  return (
    <ul class="ProjectList/Card/Links">
      {links.map((link, i) => (
        <li class="ProjectList/Card/Links-item" key={i}>
          <a class="Button Button--regular-outline" href={link.url}>{link.text}</a>
        </li>
      ))}
    </ul>
  )
}
