import { html } from 'orison';
import { client } from '../../contentful.js';
import characterList from '../../partials/character-list.js';

/*
This is intentionally placed at a 'hidden' url.
*/

export default async context => {
  const entries = await client.getEntries({
    'content_type': 'character'
  });

  return html`
    <section>
      ${characterList(entries.items)}
    </section>
  `;
};