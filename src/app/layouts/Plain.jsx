import {h} from 'hyperapp'

export function Plain(props, children) {
  return (
    <div class="container">
      <main class="Main">
        <div class="hero">
          {children}
        </div>
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
  )
}
