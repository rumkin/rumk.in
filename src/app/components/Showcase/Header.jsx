import {h} from 'hyperapp'

export function ShowcaseHeader({
  title,
  subtitle = '',
}) {
  return (
    <div class="Showcase/Header">
      <h2 class="Showcase/Header-title">{title}</h2>
      {subtitle.length > 0 ? (
        <p class="Showcase/Header-subtitle">{subtitle}</p>
      ) : null}
    </div>
  )
}
