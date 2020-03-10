import {h} from 'hyperapp';
import {Link} from '../helpers/link';

export default function E404(state, actions) {
  actions.setTitle('Not Found');

  return (
    <div class="container">
      <main class="Main">
        <div class="hero">
          <h1>
            Page not found
          </h1>
          <p>
            Sorry. There is no such page. Try to look on
            the <Link href="/">main page</Link>.
          </p>
        </div>
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
  )
}
