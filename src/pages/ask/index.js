import { html } from 'orison';
import standardNav from '../../partials/standard-nav.js';

export default async () => {
  const currentPath = '/ask';

  return html`
    <section class="ask-page" data-ask-panel>
      <div class="ask-heading">
        <h1>Ask Scar</h1>
        <p class="ask-intro">Scar knows has recorded it all. Ask him yes/no questions about the adventures of Phanoria and get a clear answer from his records.</p>
      </div>
      <div class="ask-history" data-ask-history aria-live="polite">
        <p class="ask-empty" data-ask-empty>Your questions will appear here.</p>
      </div>
      <form class="ask-composer" data-ask-form>
        <label class="sr-only" for="ask-question">Ask a question</label>
        <input id="ask-question" name="question" type="text" required autocomplete="off" placeholder="Ask a yes/no question..." />
        <button type="submit" aria-label="Send question">Ask</button>
      </form>
      <p class="ask-status" data-ask-status role="status"></p>
    </section>
    ${standardNav(currentPath)}
  `;
};
