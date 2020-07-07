import { html } from 'orison';
import { client } from '../../contentful.js';
import characterList from '../../partials/character-list.js';

export default async context => {
  const entries = await client.getEntries({
    'content_type': 'character'
  });

  return html`
    ${characterList(entries.items)}
  `;
};