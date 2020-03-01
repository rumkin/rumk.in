import {h} from 'hyperapp';
import {goto} from '../helpers/link';

export default (state, actions) => {
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
            the <a
              href="/"
              onclick={goto(() => actions.pageGoto('/'))
            }>main page</a>.
          </p>
        </div>
      </main>
      <footer>© Paul Rumkin, 2020.</footer>
    </div>
  )
};
